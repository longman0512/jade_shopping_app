
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
                    const leftLandmark = landmarks[234];
                    const rightLandmark = landmarks[454];

                    const dx = leftLandmark.x - rightLandmark.x;
                    const dy = leftLandmark.y - rightLandmark.y;
                    const faceWidth = Math.sqrt(dx * dx + dy * dy);
                    const scaleFactor = Math.max(0.4, Math.min(2.5, faceWidth / 0.45));

                    const vx = leftLandmark.x - rightLandmark.x;
                    const vy = rightLandmark.y - leftLandmark.y;
                    const angleDeg = Math.atan2(vy, vx) * (180 / Math.PI);

                    if (leftEarRef.current) {
                        const x = (1 - leftLandmark.x) * 100;
                        const y = (leftLandmark.y * 100);
                        leftEarRef.current.style.left = `${x}%`;
                        leftEarRef.current.style.top = `${y}%`;
                        leftEarRef.current.style.transform = `translate(-80%, 10%) rotate(${angleDeg}deg) scale(${scaleFactor})`;
                        leftEarRef.current.style.opacity = '1';
                    }

                    if (rightEarRef.current) {
                        const x = (1 - rightLandmark.x) * 100;
                        const y = (rightLandmark.y * 100);
                        rightEarRef.current.style.left = `${x}%`;
                        rightEarRef.current.style.top = `${y}%`;
                        rightEarRef.current.style.transform = `translate(-20%, 10%) rotate(${angleDeg}deg) scale(${scaleFactor})`;
                        rightEarRef.current.style.opacity = '1';
                    }
                  } else {
                    if (leftEarRef.current) leftEarRef.current.style.opacity = '0';
                    if (rightEarRef.current) rightEarRef.current.style.opacity = '0';
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

                {/* Left Earring Overlay - z-20 */}
                <div 
                    ref={leftEarRef}
                    className="absolute w-16 md:w-24 h-16 md:h-24 transition-opacity duration-100 opacity-0 pointer-events-none z-20 origin-top"
                >
                        <img 
                        src={productImage} 
                        alt="Left Earring" 
                        className="w-full h-full object-contain drop-shadow-lg"
                    />
                </div>

                {/* Right Earring Overlay - z-20 */}
                <div 
                    ref={rightEarRef}
                    className="absolute w-16 md:w-24 h-16 md:h-24 transition-opacity duration-100 opacity-0 pointer-events-none z-20 origin-top"
                >
                        <img 
                        src={productImage} 
                        alt="Right Earring" 
                        className="w-full h-full object-contain drop-shadow-lg"
                    />
                </div>
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
