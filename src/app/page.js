import Poster from "./Components/Poster";
import Ads from "./Components/Ads";

export default function Home() {
  const s1 = "Learning is the process of gaining knowledge or skills through study, experience, or teaching, essential for growth and development.";
  const s2 = "Practice involves repeated exercises to improve skills, enhance performance, and build confidence. Consistent practice leads to mastery and success.";
  const s3 = "A test measures knowledge, understanding, or ability in a particular area. It evaluates progress, identifies gaps, and informs improvement."
  return (
    <div>
      <Poster />
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "-100px",  
          zIndex: 1,           
          position: "relative",
        }}
      >
        <Ads imgSrc="/lrn.gif" p1="Learn" p2={s1} />
        <Ads imgSrc="/prc.gif" p1="Practice" p2={s2} />
        <Ads imgSrc="/tst.gif" p1="Test" p2={s3} />
      </div>
    </div>
  );
}
