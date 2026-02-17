import React, { useState } from "react";
import ProjectDetail from "../modal/ProjectDetail.tsx";
import "../../styles/WhatIDo.css";

const projects = [
    {
        date: "2025.09 ~ 2025.( 진행중 )",
        title: "NewLearnNote: AI와 집단지성 기반 지식 관리 및 노트 앱 - 3인",
        desc: "사용자의 학습 효율을 극대화하는 AI와 집단지성 기반 지식 관리 및 노트 앱을 제공합니다. 백엔드 개발을 맡았으며, Library 관리, 사용자 맞춤형 추천 기능 등을 구현했습니다. 또한, 팀원들과 협업하여 양방향적 지식 네트워크 작업을 진행했습니다.",
        modal: "NewLearnNote",
        role: "Backend",
        isRepresentative: true,
    },
    // {
    //     date: "2025.09 ~ 2025.( 약 3주 )",
    //     title: "SILUAT: 개인 및 팀 블로그 - 3인",
    //     desc: "기존 소셜 미디어의 숫자 중심 경쟁 문화에서 벗어나, 사용자가 오늘 한 일을 사진이나 15초 이내 짧은 영상으로 하루 최대 2번만 공유할 수 있도록 제한했습니다. TODO 기능과 연계하여 일정 관리와 일상 기록을 자연스럽게 통합한 소셜 플랫폼입니다.",
    //     modal: "SILUAT",
    //     role: "Backend",
    //     isRepresentative: false,
    // },
    {
        date: "2025.07 ~ 2025.09( 약 8주 )",
        title: "TULOG: 개인 및 팀 블로그 - 3인",
        desc: "개인 및 팀 블로그 서비스를 통해 일상을 기록하고 공유할 수 있는 플랫폼을 제공합니다. 백엔드 개발을 맡았으며, 사용자 인증, 글 작성 및 관리 기능을 구현했습니다. 또한, 팀원들과 협업하여 서비스 개선 작업을 진행했습니다.",
        modal: "TULOG",
        role: "Backend",
        isRepresentative: false,
    },
    {
        date: "2025.03 ~ 2025.06( 약 14주 | 재개발 예정 )",
        title: "질병 예측 시스템 - 2인",
        desc: "단백질 서열을 통해 질병 예측을 위한 웹 서비스로, 사용자 입력 데이터를 기반으로 머신러닝 모델을 통해 질병을 예측하고 관련 정보를 제공합니다. 데이터 엔지니어링, 모델 설계에 참여하였고, 백엔드 개발을 맡았습니다.",
        modal: "DiseasePrediction",
        role: "Backend & Model Design",
        isRepresentative: false,
    },
    {
        date: "2024.12 ~ 2025.02 ( 약 12주 | 재개발 예정 )",
        title: "TripWith: 여행 플래너 서비스 - 3인",
        desc: "엑셀처럼 계획을 짤 수 있는 UI와 지도 기반 추천 기능을 결합한 웹 기반 여행 일정 플래너. 사용자끼리 플래너를 공유할 수 있고, 커뮤니티 기능, 장소 검색, 카테고리 및 태그별 관리 기능 등이 있습니다. 풀스택 개발을 맡았습니다.",
        modal: "TRIPWITH",
        role: "Backend",
        isRepresentative: false,
    },
    //{
    //    date: "2024.07 ~ 2025.08 ( 약 6주 )",
    //    title: "RentEase: C2C 렌탈 플랫폼 - 개인",
    //    desc: "사용자 간의 물품 대여를 쉽게 연결해주는 플랫폼입니다. 직관적인 UI와 다양한 필터링 기능을 제공하여 원하는 물품을 쉽게 찾고 대여할 수 있습니다.",
    //    modal: "RENTEASE",
    //    role: "Backend & Frontend",
    //    isRepresentative: false,
    //},
];

const WhatIDo = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProjectTitle, setSelectedProjectTitle] = useState("");
    const [showAll, setShowAll] = useState(false);

    const openModal = (title: string) => {
        setSelectedProjectTitle(title);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const visibleProjects = showAll ? projects : projects.slice(0, 3);

    return (
        <section className="section" id="what-i-do-section">
            <div className="wrapper" id="what-i-do-wrapper">
                <h2 className="what-i-do-section-title"> What I Do</h2>
                <p className="section-description">
                    제가 수행한 프로젝트와 역할과 기능 대한 설명입니다.
                    <br />
                    프로젝트를 진행하면서 사용한 도구와 개선점을 기록하고 있습니다.
                </p>

                <div className="timeline-wrapper">
                    <h3 className="project-section-title">Project</h3>
                    {visibleProjects.map((project, idx) => (
                        <div
                            className={`timeline-item${idx === 0 ? " first" : ""}${
                                project.isRepresentative ? " representative" : ""
                            }`}
                            key={idx}
                        >
                            <div className={`timeline-dot${project.isRepresentative ? " representative-dot" : ""}`} />
                            <div className="timeline-content">
                                {project.isRepresentative && (
                                    <div className="representative-badge">
                                        <span>최근 진행 중인 프로젝트</span>
                                    </div>
                                )}
                                <span className="timeline-date">{project.date}</span>
                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-role">
                                    {" "}
                                    {">>>"} Role: {project.role}
                                </p>
                                <p className="project-description">{project.desc}</p>
                                <button
                                    className={`project-detail-button${
                                        project.isRepresentative ? " representative-button" : ""
                                    }`}
                                    onClick={() => openModal(project.modal)}
                                >
                                    자세히 보기
                                </button>
                            </div>
                        </div>
                    ))}
                    {
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            {!showAll ? (
                                <button className="project-more-or-hide-button" onClick={() => setShowAll(true)}>
                                    더보기
                                </button>
                            ) : (
                                <button className="project-more-or-hide-button" onClick={() => setShowAll(false)}>
                                    숨기기
                                </button>
                            )}
                        </div>
                    }
                    <ProjectDetail isOpen={modalOpen} onClose={closeModal} projectTitle={selectedProjectTitle} />
                </div>
            </div>
        </section>
    );
};

export default WhatIDo;
