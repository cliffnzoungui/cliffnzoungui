
document.getElementById("theme-toggle").onclick=()=>{
 document.body.classList.toggle("light");
};

function openCertif(path){
 const pwd = prompt("Mot de passe requis :");
 if(pwd === "recrute_moi"){ window.open(path, "_blank"); }
 else{ alert("Mot de passe incorrect"); }
}
