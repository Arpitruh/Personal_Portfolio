import type {Metadata} from "next";
import {PortfolioAssistant} from "@/components/portfolio-assistant";
export const metadata:Metadata={title:"Portfolio Assistant",description:"Ask a privacy-friendly portfolio guide about documented projects, skills and experience.",alternates:{canonical:"/assistant"}};
export default function AssistantPage(){return <main className="page" id="main"><div className="container"><div className="page-heading"><span className="eyebrow">PORTFOLIO GUIDE · FULLY CLIENT-SIDE</span><h1>Questions? <em>Ask here.</em></h1><p>Explore published project details conversationally, with transparent answers and links to source pages.</p></div><PortfolioAssistant/></div></main>;}
