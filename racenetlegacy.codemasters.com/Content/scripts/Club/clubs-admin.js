var $clubRoster;

function updateClubRoster() {
    if ($clubRoster) {
        if ($clubRoster.length) {
            $clubRoster.scope().get();
        }
    }
}

$(document).ready(function () {
    $clubRoster = $('#club_roster');

    $body.on('click', '.cta.promote_club_membership', function (e) {
        e.preventDefault();

        promoteClubMembership($(this));
    });

    $body.on('click', '.cta.demote_club_membership', function (e) {
        e.preventDefault();

        demoteClubMembership($(this));
    });

    $body.on('click', '.cta.kick_from_club', function (e) {
        e.preventDefault();

        kickFromClub($(this));
    });

    $body.on('click', '.cta.accept_club_membership', function (e) {
        e.preventDefault();

        acceptClubMembership($(this));
    });

    $body.on('click', '.cta.reject_club_membership', function (e) {
        e.preventDefault();

        rejectClubMembership($(this));
    });

    function promoteClubMembership(button) {
        var playerId = button.data('player-id');
        var teamId = button.data('team-id');
        var src = promoteClubMembershipUrl + "?playerId=" + escape(playerId) + "&teamId=" + escape(teamId);

        confirmModal(src);
    }

    function demoteClubMembership(button) {
        var playerId = button.data('player-id');
        var teamId = button.data('team-id');
        var src = demoteClubMembershipUrl + "?playerId=" + escape(playerId) + "&teamId=" + escape(teamId);

        confirmModal(src);
    }

    function kickFromClub(button) {
        var playerId = button.data('player-id');
        var teamId = button.data('team-id');
        var src = kickFromClubUrl + "?playerId=" + escape(playerId) + "&teamId=" + escape(teamId);

        confirmModal(src);
    }

    function acceptClubMembership(button) {
        var playerId = button.data('player-id');
        var teamId = button.data('team-id');
        var src = acceptClubMembershipUrl + "?playerId=" + escape(playerId) + "&teamId=" + escape(teamId);

        confirmModal(src);
    }

    function rejectClubMembership(button) {
        var playerId = button.data('player-id');
        var teamId = button.data('team-id');
        var src = rejectClubMembershipUrl + "?playerId=" + escape(playerId) + "&teamId=" + escape(teamId);

        confirmModal(src);
    }
});