function addPreloaderCompleteClass() {
    $(window).on('load', function() {
        $('.preloader').addClass('complete');
    });
}

function hideElementOnScroll(selector, targetSelector, offset = 100) {
    var sectionOffset = $(targetSelector).offset().top;
    var link = $(selector);
    $(window).on("scroll", function() {
        if ($(window).scrollTop() > sectionOffset - offset) {
            link.addClass("hidden");
        } else {
            link.removeClass("hidden");
        }
    });
}

function scrollOnClick(selector, animationDuration = 450) {
    function scrollToSection(event) {
        event.preventDefault();
        var $section = $($(this).attr('href'));
        $('html, body').animate({
            scrollTop: $section.offset().top
        }, animationDuration);
    }

    $(selector).on('click', scrollToSection);
}

function fadeScroll(selector) {
    $(window).on('scroll', function() {
        $(selector).each(function() {
            var elemTop = $(this).offset().top;
            var elemBottom = elemTop + $(this).outerHeight();
            var winTop = $(window).scrollTop();
            var winBottom = winTop + $(window).height();
            if (elemBottom >= winTop && elemTop <= winBottom) {
                $(this).css('opacity', '1');
            } else {
                $(this).css('opacity', '0');
            }
        });
    });
}

function animateImageOnHover(containerSelector, imgSelector, duration, scale) {
    $(document).ready(function() {
        $(containerSelector).find(imgSelector).hover(function() {
            $(this).stop().animate({
                'opacity': '0.8',
                'transform': 'scale(' + scale + ')'
            }, duration);
        }, function() {
            $(this).stop().animate({
                'opacity': '1',
                'transform': 'scale(1)'
            }, duration);
        });
    });
}

function sendMail() {
    $("#btnSubmit").on("click", function() {
        var $this = $(this);
        var $caption = $this.html();
        var form = "#form";
        var formData = $(form).serializeArray();
        var route = $(form).attr('action');

        $.ajax({
            type: "POST",
            url: route,
            data: formData,
            beforeSend: function() {
                $this.attr('disabled', true).html("Processing...");
            },
            success: function(response) {

                response = JSON.parse(response);

                if (!response.hasOwnProperty('has_error')) {

                    Swal.fire({
                        icon: 'success',
                        title: 'Success.',
                        text: response.response
                    });

                    resetForm(form);
                } else {

                    validationForm("#form", response.errors);
                }

                $this.attr('disabled', false).html($caption);

            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.error(XMLHttpRequest);
                console.error(textStatus);
                console.error(errorThrown);
            }
        });
    });
}

/**
 * A validation form function that will parse the json array and display to each fields
 *
 * @param {string} selector - The form selector
 * @param {json} errors - The json array response from the server form validation
 * @return {any}
 */
function validationForm(selector, errors) {
    // Loop the form errors
    $.each(errors, function(fieldName, fieldErrors) {
        $.each(fieldErrors, function(errorType, errorValue) {

            var fieldSelector = selector + " [email='" + fieldName + "']";

            if ($(fieldSelector).parents(".form-floating").hasClass("error")) {
                $(fieldSelector).parents(".form-floating").find(".error-message").remove();
                $(fieldSelector).parents(".form-floating").removeClass("error");
            }

            $("<p class='error-message'>" + errorValue + "</p>")
                .insertAfter(fieldSelector)
                .parents(".form-floating").addClass('error');

            $(fieldSelector).on("keyup", function() {
                $(fieldSelector).parents(".form-floating").find(".error-message").remove();
                $(fieldSelector).parents(".form-floating").removeClass("error");
            });
        });
    });
}

function resetForm(selector) {
    $(selector)[0].reset();
}

$(document).ready(function() {

    sendMail();

    addPreloaderCompleteClass();

    hideElementOnScroll(".hide-on-scroll", "#about", 100);

    scrollOnClick('[data-scroll]', 500);

    fadeScroll('.fade-in-element');

    animateImageOnHover('#image-container', 'img', 300, 1.1);
});