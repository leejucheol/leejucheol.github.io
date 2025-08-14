import React from "react";
import "../../styles/IntroSection.css";
import { Link } from "react-router-dom";

const IntroSection = () => {
    return (
        <section className="section" id="intro-section">
            <div className="wrapper" id="intro-wrapper">
                <div className="intro-content">
                    <div className="main-text">
                        <h1>Jucheol Lee</h1>
                        <h2 className="position-title">Backend & ML Engineer</h2>
                        <div className="intro-description">
                            <p>도전과 모험을 좋아하는 신입 개발자 이주철입니다. </p>
                            <p>
                                제가 만든 서비스가 세상에 나와 사람들이 경험하고 삶에 도움이 되는 모습을 볼 때 가장 큰
                                성취감을 느낍니다.
                            </p>
                            <p>
                                이러한 목표를 계속해서 달성하기 위해 꾸준히 TypeScript, Python, SQL 등 개발에 대해
                                공부하고 있습니다.
                            </p>
                        </div>
                        <a href="이력서_cv.pdf" download className="download-cv-button">
                            Download CV(KOR.)
                        </a>
                        <br />
                        <a
                            href="/CV_Pitt_grine.docx"
                            download="English_CV_PittGrine.docx"
                            className="download-cv-button"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Download CV(ENG.)
                        </a>
                    </div>
                    <div className="contact-info">
                        <p>이주철</p>
                        <p>
                            <Link className="github-link" to="https://github.com/leejucheol">
                                Github: Lee Jucheol
                            </Link>
                        </p>
                        <div className="email-container">
                            <svg
                                className="email-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <polyline
                                    points="22,6 12,13 2,6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <p className="email">jcllee9239@gmail.com</p>
                        </div>

                        <button
                            className="triangle-indicator"
                            type="button"
                            onClick={() => {
                                const el = document.getElementById("what-i-do-section");
                                if (el) {
                                    el.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                            aria-label="프로젝트로 스크롤"
                        >
                            <span className="triangle-indicator-text">프로젝트 바로가기</span>
                            <svg
                                width="60"
                                height="30"
                                viewBox="0 0 32 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <polygon points="16,18 0,0 32,0" fill="#111" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IntroSection;
