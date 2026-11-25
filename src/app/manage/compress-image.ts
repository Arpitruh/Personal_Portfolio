// Browser-side compression before sending an image to the upload API.
export async function compressImage(file:File):Promise<File>{
 if(!["image/jpeg","image/png","image/webp"].includes(file.type))throw Error("Choose a JPEG, PNG or WebP image.");
 if(file.size>30*1024*1024)throw Error("Original image must be under 30 MB.");
 const bitmap=await createImageBitmap(file);
 try{
 const scale=Math.min(1,1920/Math.max(bitmap.width,bitmap.height));
 const canvas=document.createElement("canvas");
 canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
 const ctx=canvas.getContext("2d");if(!ctx)throw Error("Image compression unavailable.");
 ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
 for(const quality of [.88,.75,.6,.45]){
 const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/webp",quality));
 if(blob&&blob.type==="image/webp"&&blob.size<=2*1024*1024)return new File([blob],file.name.replace(/\.[^.]+$/,"")+".webp",{type:"image/webp"});
 }
 throw Error("Image could not be compressed below 2 MB.");
 }finally{bitmap.close();}
}
