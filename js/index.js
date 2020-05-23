let videos;
let loadindex = 0;
let scrollposition = 0;

$(document).ready(function () {
    $.post('php/videoload.php', 'action=getMovies', function (data) {
        videos = data;
        console.log(videos);
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
            loadPreview(videos[loadindex + i]);
        }
    }
    loadindex += nr;
}

function loadPreview(src) {
    $.post('php/videoload.php', 'action=readThumbnail&movieid=' + src.movie_id, function (data) {
        var preview = $(`
<div class='videopreview'>
    <div class='previewtitle'>${src.movie_name}</div>
    <div class='previewpic'>
        <img style='width:100%;height:100%' src="${data}" alt='no thumbnail found'/>
    </div>
</div>`);
        preview.attr('movie_id', src.movie_id);
        preview.click(function () {
            console.log("preview clicked");
            scrollposition = $(window).scrollTop();
            loadVideo($(this).attr("movie_id"));
        });
        $(".previewcontainer").append(preview);
    }, 'text');
}

function loadVideo(movieid) {
    $.post('php/videoload.php', 'action=loadVideo&movieid=' + movieid, function (data) {
        $(".videowrapper").html("<div class='myvideo'><video controls crossorigin playsinline id='player'></video></div>");

        const player = new Plyr('#player');
        player.source = {
            type: 'video',
            sources: [
                {
                    src: data.movie_url,
                    type: 'video/mp4',
                    size: 1080,
                }
            ],
            poster: data.thumbnail
        };
        $(".videopagewrapper").show();
        $(".previewcontainer").hide();
    }, "json");
}
