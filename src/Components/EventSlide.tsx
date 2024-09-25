import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./EventSlide.css";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { AppContext } from "../App";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const EventSlide = () => {
  const navigate = useNavigate();
  const { promotedEvents } = useContext(AppContext);
  return (
    <div className="mt-2">
      <Swiper
        spaceBetween={20}
        centeredSlides={true}
        slidesPerView={3}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        modules={[Autoplay, Navigation, Pagination]}
        onSlideChange={() => {}}
        className="mySwiperStyle"
      >
        {promotedEvents.map((event) => (
          <SwiperSlide
            key={event.id}
            onClick={() => navigate(`/event-details/${event.id}`)}
            className="hover:cursor-pointer "
          >
            <div className="event-slide">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="transition transform hover:scale-105"
              />
              <div className="font-bold">
                <h3>{event.title}</h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default EventSlide;
