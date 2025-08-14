import React, { useState, useEffect } from "react";
import "../../styles/ProjectDetail.css";
import { useNavigate } from "react-router-dom";

interface ProjectDetailProps {
    isOpen: boolean;
    onClose: () => void;
    projectTitle: string;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ isOpen, onClose, projectTitle }) => {
    const [markdownContent, setMarkdownContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen && projectTitle) {
            fetchMarkdown(projectTitle);
        }
    }, [isOpen, projectTitle]);

    const fetchMarkdown = async (title: string) => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`/projects/${title}.md`);
            if (!response.ok) {
                throw new Error(`마크다운 파일을 찾을 수 없습니다: ${title}.md`);
            }
            const content = await response.text();
            setMarkdownContent(content);
        } catch (err) {
            setError(err instanceof Error ? err.message : "파일을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const navigate = useNavigate();

    // 프로젝트명 -> 카테고리명 매핑 (수동)
    const projectToCategory: Record<string, string> = {
        TULOG: "TULOG",
        TRIPWITH: "TRIPWITH",
        RENTEASE: "RENTEASE",
        CoffeePricePredictor: "CoffeePricePredictor",
        DiseasePrediction: "DiseasePrediction",
    };

    const handleGoToBlog = () => {
        const category = projectToCategory[projectTitle] || projectTitle;
        navigate(`/blogs/category/${category}`);
    };

    const category = projectToCategory[projectTitle] || projectTitle;

    const renderMarkdown = (content: string) => {
        // 프로젝트 개요 섹션 처리
        const overviewRegex =
            /\*\*PROJECT_OVERVIEW_START\*\*([\s\S]*?)\*\*PROJECT_OVERVIEW_IMAGE\*\*([\s\S]*?)\*\*PROJECT_OVERVIEW_END\*\*/;
        const overviewMatch = content.match(overviewRegex);

        let processedContent = content;

        if (overviewMatch) {
            // 프로젝트 개요 섹션을 특별한 플레이스홀더로 교체
            processedContent = content.replace(overviewRegex, "__PROJECT_OVERVIEW_PLACEHOLDER__");
        }

        // 여러 줄 인용문, 중첩 리스트, 코드블럭 지원
        const lines = processedContent.split("\n");
        const elements: React.ReactNode[] = [];
        let quoteBuffer: string[] = [];
        let listBuffer: { text: string; sub: string[] }[] = [];
        let codeBlockBuffer: string[] = [];
        let inCodeBlock = false;
        // 텍스트 내 마크다운 처리 함수
        const processInlineMarkdown = (text: string): (string | React.ReactElement)[] => {
            // 코드 처리: ``inline code``
            const inlineCodeRegex = /`([^`]+)`/g;
            let codeParts: (string | React.ReactElement)[] = [];
            let lastCodeIdx = 0;
            let codeMatch;
            while ((codeMatch = inlineCodeRegex.exec(text)) !== null) {
                if (codeMatch.index > lastCodeIdx) {
                    codeParts.push(text.slice(lastCodeIdx, codeMatch.index));
                }
                codeParts.push(
                    <code
                        key={`inlinecode-${codeMatch.index}`}
                        style={{
                            background: "#222",
                            color: "#f8f8f2",
                            borderRadius: "4px",
                            padding: "2px 4px",
                            fontSize: "0.95em",
                        }}
                    >
                        {codeMatch[1]}
                    </code>
                );
                lastCodeIdx = inlineCodeRegex.lastIndex;
            }
            if (lastCodeIdx < text.length) {
                codeParts.push(text.slice(lastCodeIdx));
            }

            // 이미지 처리 ![alt](src)
            const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

            // 이미지 먼저 처리
            let parts: (string | React.ReactElement)[] = [];
            codeParts.forEach((segment, segIdx) => {
                if (typeof segment !== "string") {
                    parts.push(segment);
                    return;
                }
                let lastIndex = 0;
                let match;
                while ((match = imageRegex.exec(segment)) !== null) {
                    if (match.index > lastIndex) {
                        parts.push(segment.slice(lastIndex, match.index));
                    }
                    parts.push(
                        <img
                            key={`img-${segIdx}-${match.index}`}
                            src={match[2]}
                            alt={match[1]}
                            className="markdown-image"
                            style={{ maxWidth: "100%", height: "auto", margin: "10px 0" }}
                        />
                    );
                    lastIndex = imageRegex.lastIndex;
                }
                if (lastIndex < segment.length) {
                    parts.push(segment.slice(lastIndex));
                }
            });

            // 링크 처리
            parts = parts.flatMap((part, idx) => {
                if (typeof part !== "string") return [part];
                const linkParts: (string | React.ReactElement)[] = [];
                let lastIdx = 0;
                let linkMatch;
                while ((linkMatch = linkRegex.exec(part)) !== null) {
                    if (linkMatch.index > lastIdx) {
                        linkParts.push(part.slice(lastIdx, linkMatch.index));
                    }
                    linkParts.push(
                        <a
                            key={`link-${idx}-${linkMatch.index}`}
                            href={linkMatch[2]}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#4f8cff" }}
                        >
                            {linkMatch[1]}
                        </a>
                    );
                    lastIdx = linkRegex.lastIndex;
                }
                if (lastIdx < part.length) {
                    linkParts.push(part.slice(lastIdx));
                }
                return linkParts;
            });

            // bold 처리
            parts = parts.flatMap((part, idx) => {
                if (typeof part !== "string") return [part];
                const boldParts = part.split(/(\*\*.*?\*\*)/g);
                return boldParts.map((b, bidx) =>
                    b.startsWith("**") && b.endsWith("**") ? (
                        <strong key={`bold-${idx}-${bidx}`}>{b.slice(2, -2)}</strong>
                    ) : (
                        b
                    )
                );
            });

            return parts.length > 0 ? parts : [text];
        };

        const flushQuote = () => {
            if (quoteBuffer.length > 0) {
                elements.push(
                    <blockquote
                        key={`quote-${elements.length}`}
                        style={{
                            color: "#888",
                            borderLeft: "4px solid #eee",
                            paddingLeft: "12px",
                            margin: "8px 0",
                            backgroundColor: "#f9f9f9",
                        }}
                    >
                        {quoteBuffer.map((line, idx) => (
                            <div key={idx}>{processInlineMarkdown(line.replace(/^>\s?/, ""))}</div>
                        ))}
                    </blockquote>
                );
                quoteBuffer = [];
            }
        };

        const flushList = () => {
            if (listBuffer.length > 0) {
                elements.push(
                    <ul key={`ul-${elements.length}`} style={{ margin: "8px 0 8px 20px" }}>
                        {listBuffer.map((item, idx) => (
                            <li key={idx}>
                                {processInlineMarkdown(item.text)}
                                {item.sub.length > 0 && (
                                    <ul style={{ marginLeft: "18px", marginTop: "8px" }}>
                                        {item.sub.map((sub, subIdx) => (
                                            <li key={subIdx}>{processInlineMarkdown(sub)}</li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                );
                listBuffer = [];
            }
        };

        const flushCodeBlock = () => {
            if (codeBlockBuffer.length > 0) {
                elements.push(
                    <pre
                        key={`codeblock-${elements.length}`}
                        style={{
                            background: "#222",
                            color: "#f8f8f2",
                            borderRadius: "4px",
                            padding: "2px 4px",
                            fontSize: "0.95em",
                            overflowX: "auto",
                            margin: "12px 0",
                        }}
                    >
                        <code>{codeBlockBuffer.join("\n")}</code>
                    </pre>
                );
                codeBlockBuffer = [];
            }
        };

        lines.forEach((line, index) => {
            // 코드블럭 시작/끝
            const codeBlockStart = /^```(\w*)/.exec(line);
            if (codeBlockStart) {
                if (!inCodeBlock) {
                    flushQuote();
                    flushList();
                    inCodeBlock = true;
                } else {
                    // 코드블럭 종료
                    flushCodeBlock();
                    inCodeBlock = false;
                }
                return;
            }
            if (inCodeBlock) {
                codeBlockBuffer.push(line);
                return;
            }

            const mainListMatch = /^- (.*)/.exec(line);
            const subListMatch = /^[\s\t]*- (.*)/.exec(line);

            if (line.startsWith(">")) {
                flushList();
                quoteBuffer.push(line);
            } else if (mainListMatch && !line.match(/^[\s\t]/)) {
                // 메인 리스트 (앞에 공백이나 탭이 없는 경우)
                flushQuote();
                flushList();
                listBuffer.push({ text: mainListMatch[1], sub: [] });
            } else if (subListMatch && line.match(/^[\s\t]/) && listBuffer.length > 0) {
                // 서브 리스트 (앞에 공백이나 탭이 있는 경우)
                const subMatch = /^[\s\t]*- (.*)/.exec(line);
                if (subMatch) {
                    listBuffer[listBuffer.length - 1].sub.push(subMatch[1]);
                }
            } else {
                flushQuote();
                flushList();
                if (line.startsWith("# ")) {
                    elements.push(<h1 key={index}>{processInlineMarkdown(line.slice(2))}</h1>);
                } else if (line.startsWith("## ")) {
                    elements.push(<h2 key={index}>{processInlineMarkdown(line.slice(3))}</h2>);
                } else if (line.startsWith("### ")) {
                    elements.push(<h3 key={index}>{processInlineMarkdown(line.slice(4))}</h3>);
                } else if (line.trim() === "") {
                    elements.push(<br key={index} />);
                } else if (line.trim() === "__PROJECT_OVERVIEW_PLACEHOLDER__") {
                    if (overviewMatch) {
                        const overviewText = overviewMatch[1].trim();
                        const overviewImage = overviewMatch[2].trim();

                        // Flex 레이아웃으로 렌더링
                        elements.push(
                            <div
                                key="project-overview"
                                style={{
                                    display: "flex",
                                    gap: "30px",
                                    alignItems: "flex-start",
                                    marginTop: "30px",
                                    marginBottom: "30px",
                                    flexWrap: "wrap",
                                }}
                            >
                                <div style={{ flex: "1", minWidth: "300px" }}>
                                    {(() => {
                                        const overviewLines = overviewText.split("\n");
                                        const processedItems: React.ReactNode[] = [];
                                        type MainItem = { text: string; subs: string[] };
                                        let currentMainItem: MainItem | null = null;

                                        overviewLines.forEach((textLine, idx) => {
                                            const trimmedLine = textLine.trim();

                                            if (trimmedLine.startsWith("- ") && !textLine.match(/^\s/)) {
                                                // 메인 리스트 항목 (앞에 공백이 없는 경우)
                                                if (currentMainItem) {
                                                    // 이전 메인 항목을 완성
                                                    processedItems.push(
                                                        <li
                                                            key={`main-${processedItems.length}`}
                                                            style={{ marginBottom: "8px" }}
                                                        >
                                                            {processInlineMarkdown(currentMainItem.text)}
                                                            {currentMainItem.subs.length > 0 && (
                                                                <ul style={{ marginLeft: "20px", marginTop: "4px" }}>
                                                                    {currentMainItem.subs.map((sub, subIdx) => (
                                                                        <li
                                                                            key={subIdx}
                                                                            style={{ marginBottom: "2px" }}
                                                                        >
                                                                            {processInlineMarkdown(sub)}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </li>
                                                    );
                                                }
                                                currentMainItem = { text: trimmedLine.slice(2), subs: [] };
                                            } else if (trimmedLine.startsWith("- ") && textLine.match(/^\s/)) {
                                                // 서브 리스트 항목 (앞에 공백이 있는 경우)
                                                if (currentMainItem) {
                                                    currentMainItem.subs.push(trimmedLine.slice(2));
                                                }
                                            }
                                        });

                                        // 마지막 메인 항목 처리
                                        if (currentMainItem) {
                                            const item = currentMainItem;
                                            processedItems.push(
                                                <li
                                                    key={`main-${processedItems.length}`}
                                                    style={{ marginBottom: "8px" }}
                                                >
                                                    {processInlineMarkdown(item.text)}
                                                    {item.subs.length > 0 && (
                                                        <ul style={{ marginLeft: "20px", marginTop: "4px" }}>
                                                            {item.subs.map((sub, subIdx) => (
                                                                <li key={subIdx} style={{ marginBottom: "2px" }}>
                                                                    {processInlineMarkdown(sub)}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </li>
                                            );
                                        }

                                        return <ul style={{ margin: "8px 0 8px 20px" }}>{processedItems}</ul>;
                                    })()}
                                </div>
                                <div style={{ flex: "1", minWidth: "250px" }}>
                                    {processInlineMarkdown(overviewImage)}
                                </div>
                            </div>
                        );
                    }
                } else if (line.trim() !== "") {
                    elements.push(<p key={index}>{processInlineMarkdown(line)}</p>);
                }
            }
        });
        flushQuote();
        flushList();
        flushCodeBlock();

        return elements;
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>
                <button className="go-to-blog-button" onClick={handleGoToBlog}>
                    {category} 블로그 이동
                </button>
                {loading && <p>로딩 중...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && markdownContent && (
                    <>
                        <div className="markdown-content">{renderMarkdown(markdownContent)}</div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProjectDetail;
