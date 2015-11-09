//setup before functions
var typingTimer; 
var doneTypingInterval = 500; 

$(function() {

    var baseColors = {
        'sentiment': [255, 99, 71],
        'business': [8, 81, 156],
        'lifestyle': [73, 0, 106],
        'science and technology': [63, 0, 125],
        'arts and culture': [142, 1, 82],
        'food and drink': [127, 59, 8],
        'religion': [0, 109, 44],
        'sports and recreation': [49, 54, 149],
        'politics': [127, 39, 4] 
    };

    $(".highlight").click(function() {
        var classes = 'blue grey-text text-lighten-3 grey lighten-3';
        $(".highlighted").toggleClass(classes);
        $(".highlighted").removeClass("highlighted");
        $(this).toggleClass(classes);
        $(this).toggleClass("highlighted");
    });

    var highlightedSpan = function(substring, color, percentage) {
        var colorString = color.join(", ") + ", ";
        return '<span style="background-color: rgba(' + colorString + percentage.toString() + ')">' + substring + '</span>';
    }

    function replaceAll(str, find, replace) {
      return str.split(find).join(replace);
    }

    var highlightText = function(text, category, substring, percentage) {
        var color = baseColors[category];
        var html = replaceAll(text, substring, highlightedSpan(substring, color, percentage));
        $('#editor').html(html);
        return html;
    }

    var splitSentences = function(text) {
        return text.match( /[^\.!\?]+[\.!\?]+/g )
    }

    var indico = function(content, api) {
        return $.post('/',
            JSON.stringify({
                'data': content,
                'api': api
            })
        );
    }

    var notEmpty = function (value) {
      return value !== "";
    }


    var updateHighlighted = function() {
        var text = $('#editor').text()
        var sentences = splitSentences(text).filter(notEmpty);
        var api = $('.highlighted').text()
        indico(sentences, api).then(function(data) {
            var values = JSON.parse(data);
            for (var i=0; i<sentences.length; i++) {
                text = highlightText(text, api, sentences[i], values[i]);
            }
        })
    }

    $('#editor').keyup(function(){
        clearTimeout(typingTimer);
        if ($('#editor').val) {
            typingTimer = setTimeout(updateHighlighted, doneTypingInterval);
        }
    });

    $('.highlight').click(function() {
        updateHighlighted();
    })
});
