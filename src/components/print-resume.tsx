"use client";
export function PrintResume(){
  function printSummary(){
    const details=document.querySelector<HTMLDetailsElement>(".resume-overview");
    const wasOpen=details?.open;
    if(details)details.open=true;
    window.print();
    if(details&&!wasOpen)details.open=false;
  }
  return <button className="btn btn-outline" type="button" onClick={printSummary}>Print / Save as PDF ↗</button>;
}
