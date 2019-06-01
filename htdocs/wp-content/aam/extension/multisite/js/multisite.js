/**
 * ======================================================================
 * LICENSE: This file is subject to the terms and conditions defined in *
 * file 'license.txt', which is part of this source code package.       *
 * ======================================================================
 */

(function ($) {

    /**
     * 
     * @param {type} id
     * @returns {Boolean}
     */
    function isCurrent(id) {
        return (aamMultisite.current === id);
    }

    /**
     * 
     * @returns {undefined}
     */
    function initialize() {
        $('#site-list').DataTable({
            autoWidth: false,
            ordering: false,
            dom: 'trip',
            pagingType: 'simple',
            processing: true,
            serverSide: true,
            ajax: {
                url: aamLocal.ajaxurl,
                type: 'POST',
                data: {
                    action: 'aam',
                    sub_action: 'Multisite.getTable',
                    _ajax_nonce: aamLocal.nonce
                }
            },
            columnDefs: [
                {visible: false, targets: [0, 1, 2, 5, 6]}
            ],
            language: {
                search: '_INPUT_',
                searchPlaceholder: aam.__('Search Site'),
                info: aam.__('_TOTAL_ sites(s)'),
                infoFiltered: ''
            },
            createdRow: function (row, data) {
                var main = (parseInt(data[5]) ? ' <small>main site</small>' : '');
                
                if (isCurrent(data[0])) {
                    $('td:eq(0)', row).html(
                        '<strong>' + data[3] + '</strong>' + main
                    );
                } else {
                    $('td:eq(0)', row).html(
                        '<span>' + data[3] + '</span>' + main
                    );
                }

                var actions = data[4].split(',');

                var container = $('<div/>', {'class': 'aam-row-actions'});
                $.each(actions, function (i, action) {
                    switch (action) {
                        case 'manage':
                            $(container).append($('<i/>', {
                                'class': 'aam-row-action ' + (parseInt(data[6]) ? 'icon-link' : 'icon-cog') + ' text-info'
                            }).bind('click', function () {
                                if (parseInt(data[6])) {
                                    window.open(data[1], '_blank');
                                } else {
                                    aamMultisite.current = data[0];
                                    aamLocal.url.site    = data[1];
                                    aamLocal.ajaxurl     = data[2];

                                    $('#site-list tbody tr strong').each(function () {
                                        $(this).replaceWith(
                                               '<span>' + $(this).text() + '</span>'
                                        ); 
                                    });
                                    $('td:eq(0) span', row).replaceWith(
                                            '<strong>' + data[3] + '</strong>'
                                    );
                                    $('i.icon-cog', container).attr(
                                        'class', 'aam-row-action icon-spin4 animate-spin'
                                    );

                                    $('i.icon-spin4', container).attr(
                                        'class', 'aam-row-action icon-cog text-info'
                                    );
                                    aam.triggerHook('refresh');
                                }
                            }));
                            break;

                        default:
                            break;
                    }
                });
                $('td:eq(1)', row).html(container);

            }
        });
    }

    $(document).ready(function () {
        initialize();
    });

})(jQuery);