document.addEventListener("DOMContentLoaded", () => {
    let data_stack = new Stack("data-stack", 5);
    let call_stack = new Stack("call-stack", 5);

    $.ajax({
        url: "/run-debug",
        type: 'post',
        dataType: 'json',
        data: {},
        success: function(result) {
            Swal.fire({
                icon: result.icon,
                title: result.title,
                text: result.text,
            }).then(function() {
                $("#code").html(result.code);
                $("#pc").html(result.pc);

                let i = 0;
                $("#register").find('th').each((column, th) => {
                    $(th).html(result.register[i]);
                    i++;
                });
            });
        },
    });
});