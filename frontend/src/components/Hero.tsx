import React, { useState, useEffect } from "react";

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    {
      src: "../images/1.jpg",
      caption: "Giày thể thao năng động - Phong cách hiện đại",
    },
    {
      src: "../images/2.jpg",
      caption: "Giày sneaker thời thượng - Thoải mái mọi bước đi",
    },
    {
      src: "../images/3.jpg",
      caption: "Giày cao cấp - Chất lượng và sang trọng",
    },
    {
      src: "../images/4.jpg",
      caption: "Giày cao cấp - Chất lượng và sang trọng",
    },
    {
      src: "../images/5.jpg",
      caption: "Giày cao cấp - Chất lượng và sang trọng",
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goToPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className={`relative ${className || "w-full h-screen"}`}>
      <div className="w-full h-full overflow-hidden relative">
        <div
          className="flex transition-transform duration-1000 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0 relative h-full">
              <img
                src={image.src}
                alt={image.caption}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end px-16 pb-20"
              >
                <h2 className="text-white text-5xl md:text-6xl font-extrabold max-w-2xl leading-tight">
                  {image.caption}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <button
        onClick={goToPrev}
        className="absolute top-1/2 left-8 -translate-y-1/2 p-3 hover:bg-white shadow-md rounded-full"
      >
        &lt;
      </button>

      <button
        onClick={goToNext}
        className="absolute top-1/2 right-8 -translate-y-1/2 p-3 hover:bg-white shadow-md rounded-full"
      >
        &gt;
      </button>

      {/* Dots */}
      <ul className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <li
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${currentIndex === index
              ? "w-8 bg-black"
              : "bg-white opacity-50"
              }`}
          ></li>
        ))}
      </ul>

    </div>
  );
};

export default Hero;
