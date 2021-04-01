
const btnSearch = document.getElementById("search-btn");
const tbSearch = document.getElementById("search-tb")

btnSearch.onclick = function(){
    const locId = tbSearch.value;
    if(locId==""){
        alert("please enter a valid location id")
    }
    else{
        document.location.replace(`/search/${locId}`)
        //window.history.pushState({},"",);
    }
}