import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./EventSlide.css";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

const EventSlide = ({ promotedEvents }) => {
  console.log("promotedEvents", promotedEvents);
  return (
    <Swiper
      spaceBetween={20}
      centeredSlides={true}
      slidesPerView={3}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      navigation={true}
      loop={true}
      modules={[Autoplay, Navigation, Pagination]}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      className="mySwiperStyle"
    >
      {promotedEvents.map((event) => (
        <SwiperSlide key={event.id}>
          <div className="event-slide">
            <img src={event.imageUrl} alt={event.title} />
            <div className="event-slide-content">
              <h3>{event.title}</h3>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default EventSlide;
