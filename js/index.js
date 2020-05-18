var videos;
var loadindex = 0;
var scrollposition = 0;

$(document).ready(function () {
    $.post('php/videoload.php', 'action', function (data) {
        videos = data;
        loadPreviewBlock(12);
    }, 'json');

    $(".closebutton").click(function () {
        $(".videopagewrapper").hide();
        $(".previewcontainer").show();
        // scroll back to last scroll position
        $(window).scrollTop(scrollposition);
        $(".videowrapper").html("");
    });
});

$(window).scroll(function () {
    if ($(window).scrollTop() >= (($(document).height() - $(window).height() - 60))) {
        if ($(".videowrapper").html() == "") {
            loadPreviewBlock(6);
        }
    }
});

function loadPreviewBlock(nr) {
    for (let i = 0; i < nr; i++) {
        if (loadindex + i < videos.length) {
            if (videos[loadindex + i] != "." && videos[loadindex + i] != "..") {
                loadPreview(videos[loadindex + i]);
            } else {
                nr++;
            }

        }
    }
    loadindex += nr;
}

function loadPreview(src) {
    var preview = $("<div class='videopreview'><div class='previewtitle'>" + src + "</div><div class='previewpic'><img style='width:100%;height:100%' src=\"videos/thumbnails/" + src + ".jpg\" alt='no thumbnail found'></img></div></div>");
    preview.attr('videourl', "videos/prn/" + src);
    preview.attr('thumbnailurl', "videos/thumbnails/" + src);
    preview.click(function () {
        console.log("preview clicked");
        scrollposition = $(window).scrollTop();
        loadVideo($(this).attr("videourl"), $(this).attr("thumbnailurl") + ".jpg");
    });
    $(".previewcontainer").append(preview);
}

function loadVideo(src, posterlink) {
    $(".videowrapper").html("<div class='myvideo'><video controls crossorigin playsinline id='player'></video></div>");

    const player = new Plyr('#player');
    player.source = {
        type: 'video',
        sources: [
            {
                src: src,
                type: 'video/mp4',
                size: 1080,
            }
        ],
        poster: posterlink
    };
    $(".videopagewrapper").show();
    $(".previewcontainer").hide();
}
