/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


(function() {
    var likelihoodLabel = [
        "Almost Certain",
        "Likely",
        "Moderate",
        "Unlikely",
        "Rare"
    ];
    var consequenceLabel = [
        "Insignificant",
        "Minor",
        "Moderate",
        "Major",
        "Catastophic"
    ];
    
    var updateRiskRating = function() {
        var consequenceRating = $("#consequence").val();
        var likelihoodRating = $("#likelihood").val();

        $("#consequenceRating").html(consequenceLabel[consequenceRating]);
        $("#likelihoodRating").html(likelihoodLabel[likelihoodRating]);
        
        var likelihoodOffset = 2 + parseInt(likelihoodRating);
        var consequenceOffset = parseInt(consequenceRating);
        var cellQuery = "tr:eq("+likelihoodOffset+") td:eq("+consequenceOffset+")";
        $("#riskRating").html($(cellQuery).html()).removeClass().addClass($(cellQuery).attr("class"));
    }

    $("#consequence").change(updateRiskRating);
    $("#likelihood").change(updateRiskRating);

    $(".riskMatrix td").click(function() {
        var column = $(this).parent().children().index(this)-1;
        var row = $(this).parent().parent().children().index($(this).parent())-2;
        $("#consequence").val(column);
        $("#likelihood").val(row);
        updateRiskRating();
        //alert(column);
        //alert(row);
    });

    updateRiskRating();

    if (!Modernizr.inputtypes.range) {
        window.setTimeout(function() {
            $(".error").slideDown('slow');
        }, 500);
    }

})();