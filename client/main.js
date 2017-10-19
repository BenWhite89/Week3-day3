$(function() {
    const destination = `http://localhost:3000/api/chirps`;
    let body = '';

    function doubleDigits(input) {
        if (input.length > 1 || input > 9) {
            return input;
        } else {
            return `0${input}`;
        }
    };

    function tripleDigits(input) {
        if (input.length > 2 || input > 99) {
            return input;
        } else {
            return `0${input}`;
        }
    }

    function Chirp (message, timestamp) {
        this.user = 'Ben';
        this.message = message;
        this.timestamp = timestamp;
    }

    var refresh = function() {
         $.get(destination,function(data) {
            let index = 0;
            data.reverse().forEach(function(e) {
                $(`#feed`).append(`<div id="${index}" class="chirp"></div>`);
                $(`#${index}`).append(`<div class="chirp user">${e.user}</div>`);
                $(`#${index}`).append(`<div class="chirp msg">${e.message}</div>`);
                $(`#${index}`).append(`<div class="chirp ts">${e.timestamp}</div>`);
                index += 1;
            });
        })
    }

    refresh();

    $('.field input').keyup(function() {
        if ($(this).val().length == 0)  {
            $('.submit input').attr('disabled', 'disabled');
        } else {
            $('.submit input').removeAttr('disabled');
        }
    });

    $(`#chirp-submit`).click(function(e) {
        e.preventDefault();

        let now = new Date,
            yr = now.getFullYear(),
            mo = doubleDigits(now.getMonth()),
            d = doubleDigits(now.getDate()),
            h = doubleDigits(now.getHours()),
            mi = doubleDigits(now.getMinutes()),
            s = doubleDigits(now.getSeconds()),
            ms = tripleDigits(now.getMilliseconds()),
            formattedDate = `${yr}-${mo}-${d}T${h}:${mi}:${s}.${ms}Z`,

            chirp = new Chirp($(`#chirp-text`).val(), formattedDate),
            chirpJSON = JSON.stringify(chirp);

        function submit() {
            $.ajax({
                method: 'POST',
                url: destination,
                contentType: "json",
                data: chirpJSON,
                async: false,
            })
        }

        $.when(submit()).done(function() {
            $('#feed').empty();
            refresh();
        })


        $('.submit input').attr('disabled', 'disabled');
        $(`#chirp-text`).val("");
    })
});