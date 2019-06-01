/* Wordpress Admin Area Scripts */
// ToDo: Place this file in a directory more suitable for its purpose, so as to separate it from the themes/actions


// (function ($) {
//
//  NOTE: This has been commented out because it was causing issues with date picker values being written to the database.
//
//     initializeDatepickers();
//
//     acf.add_action('append', function () {
//         initializeDatepickers();
//     });
//
//     function initializeDatepickers(){
//
//         $('.acf-field-57e06364a4d13 input').removeClass('hasDatepicker').datepicker({
//             dateFormat: "mm/dd/yy",
//             changeMonth: true,
//             changeYear: true,
//             beforeShowDay: function (date) {
//                 var day = date.getDay();
//                 if (day != 1) { //only enable mondays
//                     return [false, "disabled"]
//                 }
//                 else {
//                     return [true, "enabled"]
//                 }
//             }
//         });
//
//         $('.acf-field-57e063f9a4d14 input').removeClass('hasDatepicker').datepicker({
//             dateFormat: "mm/dd/yy",
//             changeMonth: true,
//             changeYear: true,
//             beforeShowDay: function (date) {
//                 var day = date.getDay();
//                 if (day != 0) { //only enable sundays
//                     return [false, "disabled"]
//                 }
//                 else {
//                     return [true, "enabled"]
//                 }
//             }
//         });
//
//         $('.acf-field-57ee7184a7050 input').removeClass('hasDatepicker').datepicker({
//             dateFormat: "mm/dd/yy",
//             changeMonth: true,
//             changeYear: true,
//             beforeShowDay: function (date) {
//                 var day = date.getDay();
//                 if (day != 1) { //only enable mondays
//                     return [false, "disabled"]
//                 }
//                 else {
//                     return [true, "enabled"]
//                 }
//             }
//         });
//
//         $('.acf-field-57ee7184a7051 input').removeClass('hasDatepicker').datepicker({
//             dateFormat: "mm/dd/yy",
//             changeMonth: true,
//             changeYear: true,
//             beforeShowDay: function (date) {
//                 var day = date.getDay();
//                 if (day != 0) { //only enable sundays
//                     return [false, "disabled"]
//                 }
//                 else {
//                     return [true, "enabled"]
//                 }
//             }
//         });
//     }
//
// })(jQuery);

// Modification to allow direct linking to ACF tabs, for the 'Add Holiday Hours' in the Center Info options page
(function($){
    // run when ACF is ready
    acf.add_action('ready', function(){
        // check if there is a hash
        // get everything after the #
        var hash = location.hash.substring(1);
        // loop through the tab buttons and try to find a match
        $('.acf-tab-wrap .acf-tab-button').each(function(i, button){
            if (hash==$(button).text().toLowerCase().replace(' ', '-')){
                // if we found a match, click it then exit the each() loop
                $(button).trigger('click');
                return false;
            }
        });
        // when a table is clicked, update the hash in the URL
        $('.acf-tab-wrap .acf-tab-button').on('click', function($el){
            location.hash='#'+$(this).text().toLowerCase().replace(' ', '-');
        });
    });
})(jQuery);

(function($){

    let storeID;

    // on select change, get ID of chosen store, query store data
    let storePicker = acf.getField('field_5beaf21a23874');
    storePicker.on('change', function(e){

        storeID = storePicker.val();
        console.log("StoreID: " + storeID);

        $.ajax({
            type : "POST",
            dataType : "JSON",
            url : ajaxurl,
            data : {action: "query_store_hours", post_id : storeID},
            success: function(response) {
                console.log(response);
                handleResponse(response);
            }
        })

        // handle store data and add hours as they appear on the store post type
        function handleResponse(response){
            console.log('Response: ');
            console.log(response);
            if(response.custom_hours){

                $('#acf-field_5beaf21a23912').trigger('click');

                let customHours = acf.getField('field_5beaf21a23912');

                let specialInstructions = acf.getField('field_5beaf21a28429');

                let mondayClosed = acf.getField('field_5beaf21a284f0').$input();
                let mondayOpen = acf.getField('field_5beaf21a28669').$input();
                let mondayClose = acf.getField('field_5beaf21a28722').$input();

                let tuesdayClosed = acf.getField('field_5beaf21a287d1').$input();
                let tuesdayOpen = acf.getField('field_5beaf21a28970').$input();
                let tuesdayClose = acf.getField('field_5beaf21a28a2b').$input();

                let wednesdayClosed = acf.getField('field_5beaf21a28ad6').$input();
                let wednesdayOpen = acf.getField('field_5beaf21a28c4d').$input();
                let wednesdayClose = acf.getField('field_5beaf21a28d0f').$input();

                let thursdayClosed = acf.getField('field_5beaf21a28de3').$input();
                let thursdayOpen = acf.getField('field_5beaf21a28f7e').$input();
                let thursdayClose = acf.getField('field_5beaf21a2903b').$input();

                let fridayClosed = acf.getField('field_5beaf21a290e6').$input();
                let fridayOpen = acf.getField('field_5beaf21a2924e').$input();
                let fridayClose = acf.getField('field_5beaf21a292f8').$input();

                let saturdayClosed = acf.getField('field_5beaf21a293b0').$input();
                let saturdayOpen = acf.getField('field_5beaf21a29532').$input();
                let saturdayClose = acf.getField('field_5beaf21a295ef').$input();

                let sundayClosed = acf.getField('field_5beaf21a2969d').$input();
                let sundayOpen = acf.getField('field_5beaf21a297fd').$input();
                let sundayClose = acf.getField('field_5beaf21a298b0').$input();


                if(response.standard_hours){
                    specialInstructions.val(response.standard_hours[0].special_instructions);

                    mondayClosed.val(response.standard_hours[0].monday_closed);
                    response.standard_hours[0].monday_closed ?
                        $('#acf-field_5b859410ddda2-0-field_5beaf21a284f0').trigger('click') : null;
                    mondayOpen.next('input').val(response.standard_hours[0].monday_open);
                    mondayClose.next('input').val(response.standard_hours[0].monday_close);

                    tuesdayClosed.val(response.standard_hours[0].tuesday_closed);
                    response.standard_hours[0].tuesday_closed ?
                        $('#acf-field_5b859410ddda2-0-field_5beaf21a287d1').trigger('click') : null;
                    tuesdayOpen.next('input').val(response.standard_hours[0].tuesday_open);
                    tuesdayClose.next('input').val(response.standard_hours[0].tuesday_close);

                    wednesdayClosed.val(response.standard_hours[0].wednesday_closed);
                    response.standard_hours[0].wednesday_closed ?
                        $('#acf-field_5b859410ddda2-0-field_5beaf21a28ad6').trigger('click') : null;
                    wednesdayOpen.next('input').val(response.standard_hours[0].wednesday_open);
                    wednesdayClose.next('input').val(response.standard_hours[0].wednesday_close);

                    thursdayClosed.val(response.standard_hours[0].thursday_closed);
                    response.standard_hours[0].thursday_closed ?
                        $('#acf-field_5b859410ddda2-0-field_5beaf21a28de3').trigger('click') : null;
                    thursdayOpen.next('input').val(response.standard_hours[0].thursday_open);
                    thursdayClose.next('input').val(response.standard_hours[0].thursday_close);

                    fridayClosed.val(response.standard_hours[0].friday_closed);
                    response.standard_hours[0].friday_closed ?
                        $('#acf-field_5b859410ddda2-0-field_5beaf21a290e6').trigger('click') : null;
                    fridayOpen.next('input').val(response.standard_hours[0].friday_open);
                    fridayClose.next('input').val(response.standard_hours[0].friday_close);

                    saturdayClosed.val(response.standard_hours[0].saturday_closed);
                    response.standard_hours[0].saturday_closed ?
                        $('#acf-field_5b859410ddda2-0-field_5beaf21a293b0').trigger('click') : null;
                    saturdayOpen.next('input').val(response.standard_hours[0].saturday_open);
                    saturdayClose.next('input').val(response.standard_hours[0].saturday_close);

                    sundayClosed.val(response.standard_hours[0].sunday_closed);
                    response.standard_hours[0].sunday_closed ?
                        $('#acf-field_5b859410ddda2-0-field_5beaf21a2969d').trigger('click') : null;
                    sundayOpen.next('input').val(response.standard_hours[0].sunday_open);
                    sundayClose.next('input').val(response.standard_hours[0].sunday_close);
                }

                if(response.alternate_hours){
                    console.log("Alternate hours");
                    console.log(response.alternate_hours);
                    response.alternate_hours.map((hours, i) => {

                        console.log(hours);

                        $('.acf-field-5beaf21a23a43 .acf-input .acf-actions .acf-button[data-event="add-row"]').trigger("click");

                        let selector = ".acf-field-5beaf21a23a43 .acf-row:eq(" + i + ") .acf-field";

                        let hoursLabel = acf.getField($('.acf-field-5beaf21a23a43 .acf-row:eq(' + i + ') .acf-field[data-name="alternate_hours_label"]'));
                        let startDate = acf.getField($('.acf-field-5beaf21a23a43 .acf-row:eq(' + i + ') .acf-field[data-name="start_date"]')).$input();
                        let endDate = acf.getField($('.acf-field-5beaf21a23a43 .acf-row:eq(' + i + ') .acf-field[data-name="end_date"]')).$input();
                        let specialInstructions = acf.getField($('.acf-field-5beaf21a23a43 .acf-row:eq(' + i + ') .acf-field[data-name="special_instructions"]'));

                        let mondayClosedAlt = acf.getField($(selector + "[data-name='monday_closed']")).$input();
                        let mondayOpenAlt = acf.getField($(selector + "[data-name='monday_open']")).$input();
                        let mondayCloseAlt = acf.getField($(selector + "[data-name='monday_close']")).$input();

                        let tuesdayClosedAlt = acf.getField($(selector + "[data-name='tuesday_closed']")).$input();
                        let tuesdayOpenAlt = acf.getField($(selector + "[data-name='tuesday_open']")).$input();
                        let tuesdayCloseAlt = acf.getField($(selector + "[data-name='tuesday_close']")).$input();

                        let wednesdayClosedAlt = acf.getField($(selector + "[data-name='wednesday_closed']")).$input();
                        let wednesdayOpenAlt = acf.getField($(selector + "[data-name='wednesday_open']")).$input();
                        let wednesdayCloseAlt = acf.getField($(selector + "[data-name='wednesday_close']")).$input();

                        let thursdayClosedAlt = acf.getField($(selector + "[data-name='thursday_closed']")).$input();
                        let thursdayOpenAlt = acf.getField($(selector + "[data-name='thursday_open']")).$input();
                        let thursdayCloseAlt = acf.getField($(selector + "[data-name='thursday_close']")).$input();

                        let fridayClosedAlt = acf.getField($(selector + "[data-name='friday_closed']")).$input();
                        let fridayOpenAlt = acf.getField($(selector + "[data-name='friday_open']")).$input();
                        let fridayCloseAlt = acf.getField($(selector + "[data-name='friday_close']")).$input();

                        let saturdayClosedAlt = acf.getField($(selector + "[data-name='saturday_closed']")).$input();
                        let saturdayOpenAlt = acf.getField($(selector + "[data-name='saturday_open']")).$input();
                        let saturdayCloseAlt = acf.getField($(selector + "[data-name='saturday_close']")).$input();

                        let sundayClosedAlt = acf.getField($(selector + "[data-name='sunday_closed']")).$input();
                        let sundayOpenAlt = acf.getField($(selector + "[data-name='sunday_open']")).$input();
                        let sundayCloseAlt = acf.getField($(selector + "[data-name='sunday_close']")).$input();

                        hoursLabel.val(hours.alternate_hours_label);
                        startDate.next('input').val(hours.start_date);
                        endDate.next('input').val(hours.end_date);
                        specialInstructions.val(hours.special_instructions);

                        mondayClosedAlt.val(hours.monday_closed);
                        hours.monday_closed ?
                            mondayClosedAlt.trigger('click') : null;
                        mondayOpenAlt.next('input').val(hours.monday_open);
                        mondayCloseAlt.next('input').val(hours.monday_close);

                        tuesdayClosedAlt.val(hours.tuesday_closed);
                        hours.tuesday_closed ?
                            tuesdayClosedAlt.trigger('click') : null;
                        tuesdayOpenAlt.next('input').val(hours.tuesday_open);
                        tuesdayCloseAlt.next('input').val(hours.tuesday_close);

                        wednesdayClosedAlt.val(hours.wednesday_closed);
                        hours.wednesday_closed ?
                            wednesdayClosedAlt.trigger('click') : null;
                        wednesdayOpenAlt.next('input').val(hours.wednesday_open);
                        wednesdayCloseAlt.next('input').val(hours.wednesday_close);

                        thursdayClosedAlt.val(hours.thursday_closed);
                        hours.thursday_closed ?
                            thursdayClosedAlt.trigger('click') : null;
                        thursdayOpenAlt.next('input').val(hours.thursday_open);
                        thursdayCloseAlt.next('input').val(hours.thursday_close);

                        fridayClosedAlt.val(hours.friday_closed);
                        hours.friday_closed ?
                            fridayClosedAlt.trigger('click') : null;
                        fridayOpenAlt.next('input').val(hours.friday_open);
                        fridayCloseAlt.next('input').val(hours.friday_close);

                        saturdayClosedAlt.val(hours.saturday_closed);
                        hours.saturday_closed ?
                            saturdayClosedAlt.trigger('click') : null;
                        saturdayOpenAlt.next('input').val(hours.saturday_open);
                        saturdayCloseAlt.next('input').val(hours.saturday_close);

                        sundayClosedAlt.val(hours.sunday_closed);
                        hours.sunday_closed ?
                            sundayClosedAlt.trigger('click') : null;
                        sundayOpenAlt.next('input').val(hours.sunday_open);
                        sundayCloseAlt.next('input').val(hours.sunday_close);
                    })
                }
                else{
                    console.log('No holiday hours');
                }
            }
        }

    });

    $('.toplevel_page_holiday_hours #post').submit((e) => {
        console.log('Submit');

        e.preventDefault();

        let data = {
            "id": storeID,
            "fields": [],
            "row_count": 0,
        }

        let fields = acf.getFields();
        let rowCounter = 1;
        let alternateHours = false;

        fields.map((field) => {

            let value = field.val();
            if(field.data.type === "time_picker"){
                value = field.$input().next('input').val();
            }

            field.data.name === 'alternate_hours' ? alternateHours = true : null;
            field.data.name === 'alternate_hours_label' ? rowCounter++ : null;

            data['fields'].push({
                "name": field.data.name,
                "key": field.data.key,
                "value": value,
                "parent": alternateHours ? 'alternate_hours' : 'standard_hours',
                "row": alternateHours ? rowCounter - 1 : rowCounter,
            });
        });

        data['row_count'] = rowCounter;

        $.ajax({
            type : "POST",
            dataType : "JSON",
            url : ajaxurl,
            data : {action: "update_store_hours", data: data},
            success: function(response) {
                console.log("Response", response);
                fieldsUpdated = true;
                location.reload(true);
            }
        })
        return false;
    });

})(jQuery);


