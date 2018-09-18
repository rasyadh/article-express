if ($('.notification').html()) {
    setTimeout(() => $('.notification').fadeOut(), 2000);
}

$(document).ready(() => {
    $('.navbar-burger').click(() => {
        $('.navbar-burger').toggleClass('is-active');
        $('.navbar-menu').toggleClass('is-active');
    });

    $('.delete').click(() => $('.notification').fadeOut());

    $('#delete-article').click(e => {
        const id = $(e.target).attr('data-id');
        if (confirm('Delete this article ?')) {
            $.ajax({
                type: 'DELETE',
                url: `/article/delete/${id}`,
                success: response => window.location.href = '/',
                error: err => console.log('err')
            });
        }
    });
});