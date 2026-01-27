
document.getElementById("theme-toggle").onclick=()=>{
 document.body.classList.toggle("light");
};

function openCertif(path){
 const pwd = prompt("Mot de passe requis :");
 if(pwd === "1234"){ window.open(path, "_blank"); }
 else{ alert("Mot de passe incorrect"); }
}
