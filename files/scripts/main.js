function globals(){}
globals.banners = 2;

function setBanner(bannerID){
	document.body.style.backgroundImage = "url(files/images/banners/banner" + bannerID + ".png)";
	document.body.style.backgroundRepeat = "no-repeat";
	document.body.style.backgroundAttachment = "fixed";
	document.body.style.backgroundPosition = "center";
	document.body.style.backgroundSize = "cover"
}

$(document).ready(function () {
	setBanner(randomInt(1, globals.banners));
});
