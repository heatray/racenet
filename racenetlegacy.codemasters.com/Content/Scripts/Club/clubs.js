var $userMembershipRequests;

function updateUserMembershipRequests() {
    if ($userMembershipRequests) {
        if ($userMembershipRequests.length) {
            $userMembershipRequests.scope().get();
        }
    }
}

$(document).ready(function () {
    $userMembershipRequests = $('#user_membership_requests');

    $.ajaxSetup({
        // Disable caching of AJAX responses
        cache: false
    });

    $body.on('submit', 'form.join_club', function (e) {
        e.preventDefault();

        joinClub($(this), joinClubResponse);
    });

    $body.on('click', '.cta.accept_club', function (e) {
        e.preventDefault();

        acceptClub($(this));
    });

    $body.on('click', '.cta.leave_club', function (e) {
        e.preventDefault();

        leaveClub($(this));
    });

    $body.on('click', '.cta.reject_club', function (e) {
        e.preventDefault();

        rejectClub($(this));
    });

    $body.on('click', '.cta.make_active_club', function (e) {
        e.preventDefault();

        makeClubActive($(this));
    });

    $body.on('click', '.cta.report_club', function (e) {
        e.preventDefault();

        reportClub($(this));
    });

    $body.on('click', '.cta.disband_club', function (e) {
        e.preventDefault();

        disbandClub($(this));
    });

    $body.on('click', '.cta.club_ranks', function () {
        confirmModal(clubRanksUrl);
    });

    function joinClub(form, callback) {
        $.post(joinClubRequestUrl, form.serialize())
            .done(function (response) {
                if (response.Result == "OK") {
                    callback(form, true);
                } else {
                    callback(form, false);
                }
            });
    }

    function joinClubResponse(form, result) {
        $(form).remove();

        try {
            updateClubList();
            updateClubRoster();
            updateUserMembershipRequests();
        } catch (e) {
        }

        if (result) {
            $.modal(document.getElementById('joined_club'), modalOptions);
        } else {
            $.modal(document.getElementById('requested_join_club'), modalOptions);
        }
    }

    function acceptClub(button) {
        var teamId = button.data('team-id');
        var src = acceptClubUrl + "?teamId=" + escape(teamId);

        confirmModal(src);
    }

    function rejectClub(button) {
        var teamId = button.data('team-id');
        var src = rejectClubUrl + "?teamId=" + escape(teamId);

        confirmModal(src);
    }

    function leaveClub(button) {
        var teamId = button.data('team-id');
        var src = leaveClubUrl + "?teamId=" + escape(teamId);

        confirmModal(src);
    }

    function makeClubActive(button) {
        var teamId = button.data('team-id');
        var src = makeClubActiveUrl + "?teamId=" + escape(teamId);

        confirmModal(src);
    }

    function reportClub(button) {
        var teamId = button.data('team-id');
        var src = reportClubUrl + "?teamId=" + escape(teamId);

        confirmModal(src);
    }

    function disbandClub(button) {
        var teamId = button.data('team-id');
        var src = disbandClubUrl + "?teamId=" + escape(teamId);

        confirmModal(src);
    }

    function updateClubList() {
        var $clubList = $('#club_listing');

        if ($clubList.length) {
            setLoading($clubList);
            $clubList.load(clubListUrl, function () {
                unsetLoading($clubList);
            });
        }
    }
});