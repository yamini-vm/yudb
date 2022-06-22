$(document).ready(function() {

    $("#debug-btn").click(() => {
        const data = {
            "path": ["empty"],
        };

        validate_and_post("/debug", data, swal_ajax_post_redirect);
    });

});