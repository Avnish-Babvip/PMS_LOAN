import { useEffect, useRef, useState } from "react";
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
import { FiEdit3 } from "react-icons/fi";
import { createPortal } from "react-dom";

const ImageViewer = ({ images = [], open, currentIndex = 0, onClose }) => {
  const galleryRef = useRef(null);
  const viewerRef = useRef(null);

  const [showNotes, setShowNotes] = useState(false);

  // Recreate viewer whenever images change
  useEffect(() => {
    if (!galleryRef.current || !images.length) return;

    if (viewerRef.current) {
      viewerRef.current.destroy();
    }

    viewerRef.current = new Viewer(galleryRef.current, {
      inline: false,
      navbar: true,
      toolbar: {
        zoomIn: true,
        zoomOut: true,
        oneToOne: true,
        reset: true,
        prev: true,
        next: true,
        rotateLeft: true,
        rotateRight: true,
        flipHorizontal: true,
        flipVertical: true,
      },
      movable: true,
      zoomable: true,
      rotatable: true,
      scalable: true,
      transition: true,
      fullscreen: true,
      keyboard: true,
      loop: false,

      hidden() {
        onClose?.();
      },
    });

    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [images]);

  useEffect(() => {
    if (!viewerRef.current) return;

    if (open) {
      viewerRef.current.show();

      // Wait for viewer to render
      setTimeout(() => {
        viewerRef.current?.view(currentIndex);
      }, 50);
    } else {
      viewerRef.current.hide();
    }
  }, [open, currentIndex]);

  return (
    <>
      {/* Hidden gallery for Viewer.js */}
      <div
        ref={galleryRef}
        style={{
          display: "none",
        }}
      >
        {images.map((src, i) => (
          <img key={i} src={src} alt={`Image ${i}`} />
        ))}
      </div>

      {/* Floating Notes Button */}
      {open && (
        <button
          onClick={() => setShowNotes(true)}
          style={{
            position: "fixed",
            top: "20px",
            left: "90%",
            transform: "translateX(-50%)",
            zIndex: 999999,
            width: "64px",
            height: "64px",
            borderRadius: "9999px",
            border: "4px solid white",
            background: "linear-gradient(135deg, #EF4444, #89101C)",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 12px 30px rgba(137,16,28,.45)",
            transition: "all .3s ease",
          }}
        >
          <FiEdit3 size={24} />
        </button>
      )}

      {/* Floating Notes Popup */}
      {open &&
        showNotes &&
        createPortal(
          <div
            className="fixed right-6 top-24 z-[999999999] w-[380px] overflow-hidden rounded-3xl bg-white shadow-2xl"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative h-18 bg-gradient-to-r from-[#EF4444] to-[#89101C]">
              {/* Floating Icon */}
              <div className="absolute left-1/2 top-full flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-gradient-to-r from-[#EF4444] to-[#89101C] shadow-xl">
                <FiEdit3 className="text-4xl text-white" />
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowNotes(false)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xl text-white transition hover:bg-white/30"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="px-6 pb-6 pt-14">
              <h3 className="mb-2 text-center text-xl font-bold text-gray-800">
                Verification Notes
              </h3>

              <textarea
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                rows={7}
                placeholder="Write your observations..."
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-[15px] outline-none transition-all focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100"
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default ImageViewer;
