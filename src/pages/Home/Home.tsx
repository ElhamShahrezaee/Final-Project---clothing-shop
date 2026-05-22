import { useAppLocale } from "../../hooks/useAppLocale";
import HomeCategories from "./components/HomeCategories";
import HomeFeaturedProducts from "./components/HomeFeaturedProducts";
import HomeNewCollectionBanner from "./components/HomeNewCollectionBanner";
import { FULL_BLEED_MEDIA_HEIGHT } from "../../styles/mediaHeights";

const LANDING_VIDEO_SRC = "/videos/landing1.mp4";

const Home = () => {
  const { dir, textAlign } = useAppLocale();

  return (
    <div dir={dir} className={textAlign}>
      <section
        className={`relative w-full overflow-hidden ${FULL_BLEED_MEDIA_HEIGHT}`}
        aria-hidden
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          controls={false}
          preload="auto"
          className="pointer-events-none h-full w-full object-cover"
          src={LANDING_VIDEO_SRC}
        />
      </section>

      <HomeCategories />

      <HomeNewCollectionBanner />

      <HomeFeaturedProducts />
    </div>
  );
};

export default Home;
