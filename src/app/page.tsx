"use client";

import "./style.css";
import Nav from "@/components/nav/Nav";
import Image from "next/image";
import Arrow from "../../public/assets/icons/arrow.svg";
import Collaborate from "../../public/assets/images/collaborate.png";
import Bookmark from "../../public/assets/icons/bookmark.svg";
import Notes from "../../public/assets/icons/notes.svg";
import Notebook from "../../public/assets/icons/notebook.svg";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  return (
    <div className="home">
      <div className="cover">
        <div className="content">
          <Nav></Nav>
          <div className="side top">
            <h1>Collaborate, Learn, Succeed Together.</h1>
            <p>
              Get started with StudyBit to learn how your community can enhance
              your learning experience.
            </p>
            <button onClick={() => router.push("/console")}>
              Get Started <Image src={Arrow} alt="Arrow up right"></Image>
            </button>
          </div>
          <div className="side bottom">
            <Image src={Collaborate} alt="Collaboration"></Image>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="content">
          <div className="container">
            <div className="item">
              <Image src={Notebook} alt="" width={40} height={40}></Image>
              <h2>Collaborative note-taking</h2>
              <p>
                Work together to determine and organize important class
                concepts.
              </p>
            </div>
            <div className="item">
              <Image src={Bookmark} alt="" width={40} height={40}></Image>
              <h2>Popular UF Classes</h2>
              <p>Find your classes and collaborate with classmates.</p>
            </div>
            <div className="item">
              <Image src={Notes} alt="" width={40} height={40}></Image>
              <h2>Individually organize</h2>
              <p>Organize your own concepts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
