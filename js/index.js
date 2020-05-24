let videos;
let loadindex = 0;
let scrollposition = 0;
let loadedvideoid = -1;

$(document).ready(function () {
    $.post('php/videoload.php', 'action=getMovies', function (data) {
        videos = data;
        loadPreviewBlock(15);
    }, 'json');

    $.post('php/videoload.php', 'action=getDbSize', function (data) {
        console.log(data);
    }, 'json');

    $(".closebutton").click(function () {
        $("#likebtn").off();
        $("#tagbutton").off();
        $(".videopagewrapper").hide();
        $(".previewcontainer").show();
        // scroll back to last scroll position
        $(window).scrollTop(scrollposition);
        $(".videowrapper").html("");
    });
});

$(window).scroll(function () {
    if ($(window).scrollTop() >= (($(document).height() - $(window).height() - 60))) {
        if ($(".videowrapper").html() === "") {
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
            loadedvideoid = $(this).attr("movie_id");
            loadVideo(loadedvideoid);
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

        $(".likefield").html("Likes: " + data.likes);

        $.post('php/videoload.php', 'action=getTags&movieid=' + loadedvideoid, function (data) {
            for (const tag in data.tags) {
                $(".videoleftbanner").append(`<div>${tag}</div>`);
            }

            console.log(data);
        }, "json");

        $("#likebtn").click(function () {
            console.log("likebtn clicked");
            $.post('php/videoload.php', 'action=addLike&movieid=' + loadedvideoid, function (data) {
                console.log(data);
            }, "json");
        });

        $("#tagbutton").click(function () {
            console.log("tagbrn clicked");
            Swal.mixin({
                input: 'text',
                confirmButtonText: 'Next &rarr;',
                showCancelButton: true,
                progressSteps: ['1', '2', '3']
            }).queue([
                {
                    title: 'Question 1',
                    text: 'Chaining swal2 modals is easy'
                },
                'Question 2',
                'Question 3'
            ]).then((result) => {
                if (result.value) {
                    const answers = JSON.stringify(result.value)
                    Swal.fire({
                        title: 'All done!',
                        html: `
        Your answers:
        <pre><code>${answers}</code></pre>
      `,
                        confirmButtonText: 'Lovely!'
                    })
                }
            })
        });

        $(".videopagewrapper").show();
        $(".previewcontainer").hide();
    }, "json");
}
