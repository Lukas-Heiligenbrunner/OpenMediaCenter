$(document).ready(function() {
  console.log("finished loading page");
  $.post('php/videoload.php','action',function(data){
    console.log(data);
    for (var i in data) {
      if (data[i] != "." && data[i] != "..") {
        //loadVideo("videos/prn/"+data[i],"");
        loadPreview(data[i]);
        console.log(data[i]);
      }

    }
  },'json');
  //loadVideo("https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4",'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg');

  $(".closebutton").click(function() {
    $(".videopagewrapper").hide();
    $(".previewcontainer").show();
    $(".videowrapper").html("");
  });
});

function loadPreview(src) {
  var preview = $("<div class='videopreview'><div class='previewtitle'>"+src+"</div><div class='previewpic'><img style='width:100%;height:100%' src=\"videos/thumbnails/"+src+".jpg\" alt='no thumbnail found'></img></div></div>");
  preview.attr('videourl',"videos/prn/"+src);
  preview.attr('thumbnailurl',"videos/thumbnails/"+src);
  preview.click(function() {
    console.log("preview clicked");
    loadVideo($(this).attr("videourl"),$(this).attr("thumbnailurl")+".jpg");
  });
  $(".previewcontainer").append(preview);
}

function loadVideo(src,posterlink) {
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
