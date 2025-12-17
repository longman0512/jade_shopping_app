
import React, { useRef, useEffect, useState } from 'react';
import { X, Camera, Sparkles, Loader } from 'lucide-react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

interface VirtualTryOnProps {
  isOpen: boolean;
  onClose: () => void;
  productImage: string;
}

export const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ isOpen, onClose, productImage }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const leftEarRef = useRef<HTMLDivElement>(null);
  const rightEarRef = useRef<HTMLDivElement>(null);


  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const lipCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const requestRef = useRef<number>(0);
  const lastVideoTimeRef = useRef<number>(-1);

  // 1. Initialize AI Model
  useEffect(() => {
    if (isOpen) {
      const initModel = async () => {
        setIsModelLoading(true);
        try {
          const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
          );
          faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
              delegate: "CPU"
            },
            outputFaceBlendshapes: false,
            runningMode: "VIDEO",
            numFaces: 1
          });
          setIsModelLoading(false);
        } catch (e) {
          console.error("Failed to load face landmarker:", e);
          setIsModelLoading(false);
        }
      };
      initModel();
    } else {
        cancelAnimationFrame(requestRef.current);
    }
  }, [isOpen]);

  // 2. Start Camera
  useEffect(() => {
    let active = true;
    if (isOpen) {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        facingMode: 'user',
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    } 
                });
                if (active) {
                    setStream(mediaStream);
                    setError('');
                } else {
                    mediaStream.getTracks().forEach(track => track.stop());
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                if (active) setError("Camera access denied. Please check permissions.");
            }
        };
        startCamera();
    }
    return () => {
        active = false;
        stopCamera();
    };
  }, [isOpen]);

  // 3. Assign Stream to Video
  useEffect(() => {
    if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsVideoReady(false);
    }
    cancelAnimationFrame(requestRef.current);
  };

  const handleVideoLoad = () => {
      setIsVideoReady(true);
      if (videoRef.current) {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
              playPromise.catch(e => console.error("Play failed:", e));
          }
          predictWebcam();
      }
  };

  type Pt = { x: number; y: number };

function toPx(
  lm: { x: number; y: number },
  w: number,
  h: number,
  mirrored = true
): Pt {
  // If your video is mirrored selfie-style, flip x.
  const x = (mirrored ? (1 - lm.x) : lm.x) * w;
  const y = lm.y * h;
  return { x, y };
}


// Smooth curve path (better than straight lines)
function buildSmoothClosedPath(ctx: CanvasRenderingContext2D, pts: Pt[]) {
  if (pts.length < 3) return;
  ctx.beginPath();

  // Start at midpoint between last and first
  const mid = (a: Pt, b: Pt) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  let p0 = pts[pts.length - 1];
  let p1 = pts[0];
  let m0 = mid(p0, p1);

  ctx.moveTo(m0.x, m0.y);

  for (let i = 0; i < pts.length; i++) {
    const curr = pts[i];
    const next = pts[(i + 1) % pts.length];
    const m1 = mid(curr, next);
    ctx.quadraticCurveTo(curr.x, curr.y, m1.x, m1.y);
  }

  ctx.closePath();
}

let prevOuter: Pt[] | null = null;
let prevInner: Pt[] | null = null;

const OUTER_LIPS = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
  409, 270, 269, 267, 0, 37, 39, 40, 185
];

// Inner mouth opening (closed loop) -> subtract this from the outer
const INNER_MOUTH = [
  78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308,
  415, 310, 311, 312, 13, 82, 81, 80, 191
];
function lerpPts(prev: Pt[] | null, next: Pt[], t: number) {
  if (!prev || prev.length !== next.length) return next;
  return next.map((p, i) => ({
    x: prev[i].x + (p.x - prev[i].x) * t,
    y: prev[i].y + (p.y - prev[i].y) * t,
  }));
}

  function drawLipstick(opts: {
  ctx: CanvasRenderingContext2D;
  landmarks: Array<{ x: number; y: number }>;
  width: number;
  height: number;
  color?: string;      // e.g. "#d81b60"
  intensity?: number;  // 0..1
  mirrored?: boolean;
}) {
  const {
    ctx, landmarks, width, height,
    color = "#d81b60",
    intensity = 0.55,
    mirrored = true,
  } = opts;

  // Build points
  const outerRaw = OUTER_LIPS.map(i => toPx(landmarks[i], width, height, mirrored));
  const innerRaw = INNER_MOUTH.map(i => toPx(landmarks[i], width, height, mirrored));

  // Temporal smoothing (reduce jitter)
  const SMOOTH = 0.35; // smaller => more stable, but more lag
  const outer = lerpPts(prevOuter, outerRaw, SMOOTH);
  const inner = lerpPts(prevInner, innerRaw, SMOOTH);
  prevOuter = outer;
  prevInner = inner;

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // 1) Create a lip mask (outer minus inner)
  ctx.globalCompositeOperation = "source-over";
  ctx.filter = "blur(2px)"; // feather edges a bit

  // Draw outer as mask
  buildSmoothClosedPath(ctx, outer);
  ctx.fillStyle = "white";
  ctx.fill();

  // Cut out inner mouth hole
  ctx.globalCompositeOperation = "destination-out";
  buildSmoothClosedPath(ctx, inner);
  ctx.fill();

  // 2) Paint lipstick only inside remaining mask
  ctx.globalCompositeOperation = "source-in";
  ctx.filter = "blur(0px)";
  ctx.fillStyle = color;
  ctx.globalAlpha = intensity;
  ctx.fillRect(0, 0, width, height);

  // 3) Blend with the underlying video for realism
  // If you're drawing on a separate overlay canvas stacked over video,
  // you can instead set the CANVAS CSS: mix-blend-mode: multiply;
  // Or do it here if you are compositing in one canvas.
  ctx.globalAlpha = 1;

  ctx.restore();
}

  const predictWebcam = () => {
    const video = videoRef.current;
    const faceLandmarker = faceLandmarkerRef.current;
    if (video && !video.paused && !video.ended && video.videoWidth > 0 && video.videoHeight > 0) {
      if (faceLandmarker) {
          try {
              if (video.currentTime !== lastVideoTimeRef.current) {
                  lastVideoTimeRef.current = video.currentTime;
                  let startTimeMs = performance.now();
                  const results = faceLandmarker.detectForVideo(video, startTimeMs);

                  if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                    const landmarks = results.faceLandmarks[0];

                    // 1. Draw Lipstick
                    if (lipCanvasRef.current) {
                        const lipCanvas = lipCanvasRef.current;
                        const ctx = lipCanvas.getContext("2d");
                        
                        lipCanvas.width = video.videoWidth;
                        lipCanvas.height = video.videoHeight;

                        if (ctx) {
                            drawLipstick({
                                ctx,
                                landmarks,
                                width: lipCanvas.width,
                                height: lipCanvas.height,
                                color: "#c2185b",
                                intensity: 0.45,
                                mirrored: true,
                            });
                        }
                    }

                    // 2. Draw Debug Landmarks (Optional)
                    if (overlayCanvasRef.current) {
                        // drawLandmarks(overlayCanvasRef.current, video, landmarks, false);
                    }

                    // 3. Position Earrings
                    const leftLandmark = landmarks[177];
                    const rightLandmark = landmarks[361];

                    const dx = leftLandmark.x - rightLandmark.x;
                    const dy = leftLandmark.y - rightLandmark.y;
                    const faceWidth = Math.sqrt(dx * dx + dy * dy);
                    const scaleFactor = Math.max(0.1, Math.min(2.5, faceWidth / 0.95));

                    const vx = leftLandmark.x - rightLandmark.x;
                    const vy = rightLandmark.y - leftLandmark.y;
                    const angleDeg = Math.atan2(vy, vx) * (180 / Math.PI);
                    const EAR_Y_OFFSET = faceWidth * 0.03; 

                    if (leftEarRef.current) {
                        const leftX = leftLandmark.x;
                        const leftY = leftLandmark.y - EAR_Y_OFFSET;
                        leftEarRef.current.style.left = `${(1 - leftX) * 100}%`;
                        leftEarRef.current.style.top  = `${leftY * 100}%`;
                        leftEarRef.current.style.transform = `translate(-35%, 1%) rotate(${angleDeg}deg) scale(${scaleFactor})`;
                        leftEarRef.current.style.opacity = '1';
                    }

                    if (rightEarRef.current) {
                        const rightX = rightLandmark.x;
                        const rightY = rightLandmark.y - EAR_Y_OFFSET;
                        rightEarRef.current.style.left = `${(1 - rightX) * 100}%`;
                        rightEarRef.current.style.top  = `${rightY * 100}%`;
                        rightEarRef.current.style.transform = `translate(-60%, 1%) rotate(${angleDeg}deg) scale(${scaleFactor})`;
                        rightEarRef.current.style.opacity = '1';
                    }
                  } else {
                    // Hide earrings if no face
                    if (leftEarRef.current) leftEarRef.current.style.opacity = '0';
                    if (rightEarRef.current) rightEarRef.current.style.opacity = '0';

                    // Clear canvases
                    const c = overlayCanvasRef.current;
                    const ctx = c?.getContext("2d");
                    if (ctx && c) ctx.clearRect(0, 0, c.width, c.height);

                    const lc = lipCanvasRef.current;
                    const lctx = lc?.getContext("2d");
                    if (lctx && lc) lctx.clearRect(0, 0, lc.width, lc.height);
                  }
              }
          } catch (err) {
              console.warn("Prediction error:", err);
          }
      }
      requestRef.current = requestAnimationFrame(predictWebcam);
    } else if (video && !video.ended) {
        requestRef.current = requestAnimationFrame(predictWebcam);
    }
  };

  function drawLandmarks(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  landmarks: any[],
  showIndex = false
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Match canvas pixels to video pixels (important!)
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // If your video is mirrored via CSS (scaleX(-1)), mirror the drawing too
  ctx.save();
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  for (let i = 0; i < landmarks.length; i++) {
    const p = landmarks[i];
    const x = p.x * canvas.width;
    const y = p.y * canvas.height;

    // dot
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "lime";
    ctx.fill();

    if (showIndex) {
      ctx.font = "10px sans-serif";
      ctx.fillStyle = "yellow";
      ctx.fillText(String(i), x + 3, y - 3);
    }
  }

  ctx.restore();
}

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[80vh] md:h-auto">
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
             <div>
                <h3 className="text-white font-medium text-lg flex items-center gap-2">
                    <Sparkles size={20} className="text-jade-400" /> AI Virtual Try-On
                </h3>
                <p className="text-white/70 text-xs">The earrings will automatically follow your ears.</p>
             </div>
             <button 
                onClick={onClose}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors backdrop-blur-md"
            >
                <X size={24} />
            </button>
        </div>

        {/* Camera View */}
        <div className="relative flex-grow bg-gray-900 w-full overflow-hidden min-h-[400px]">
            <div className="absolute inset-0 w-full h-full">
                {/* 
                    Video Element
                    - transform: scaleX(-1) for mirror effect
                    - z-0 to sit behind everything
                    - opacity-100 to ensure visibility
                */}
                <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline 
                    muted 
                    onLoadedData={handleVideoLoad}
                    style={{ transform: 'scaleX(-1)' }}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <canvas
                  ref={overlayCanvasRef}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                  }}
                />
                <canvas
                  ref={lipCanvasRef}
                  id="lipCanvas"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    mixBlendMode: "multiply",
                    opacity: 0.9,
                  }}
                />
                {/* Loading Overlay - Only visible if video is NOT ready */}
                {!isVideoReady && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white z-10">
                        {error ? (
                            <>
                                <Camera size={48} className="mb-4 text-gray-500" />
                                <p>{error}</p>
                            </>
                        ) : (
                            <>
                                <Loader size={32} className="animate-spin text-jade-500 mb-4" />
                                <p className="text-sm font-medium">Starting Camera...</p>
                            </>
                        )}
                     </div>
                )}

                {/* Model Loading Indicator - z-30 to be on top */}
                {isVideoReady && isModelLoading && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-white z-30">
                        <Loader size={16} className="animate-spin text-jade-400" />
                        <span className="text-xs">Initializing AI...</span>
                    </div>
                )}
            </div>
        </div>

        {/* Footer Instructions */}
        <div className="bg-[#121827] p-6 text-center z-20">
             <p className="text-gray-400 text-sm">
                Tip: Ensure your face is clearly visible in well-lit conditions.
             </p>
        </div>
      </div>
    </div>
  );
};
