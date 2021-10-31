<?php

header('Content-Type: application/json');
header( "Content-type: text/html" );

// Get the query string args.

$search_term = $_GET['search_term'];
$zipcode = $_GET['zip'];
$miles = $_GET['miles'];

// Set up array for JSON output and create the status object.

$json_data = array();
$status = new stdClass();

// Make sure all our parameters are here.

if ( ( $search_term == null ) ||
     ( $zipcode == null ) ||
     ( $miles == null ) ) {

    $status->state = "error";
    $status->message = "Missing parameter(s)";

} else {                        /* Away we go. . . */

    // Fetch the ZIP Code database.

    $zipinfo = json_decode( file_get_contents( "zips.json" ) );

    $zips = $zipinfo->zips;
    $lats = $zipinfo->lats;

    // Find the location data for the requested ZIP Code.
    
    $ziploc = $zips->$zipcode;
    $lat = $ziploc->lat;
    $lon = $ziploc->lon;

    // A few constants.
    
    $er = 3958.7559;            /* Radius of the Earth in miles */
    $pi = 3.1415926535;         /* Your friendly neighborhood constant Pi */
    $twopi = 2 * $pi;           /* And its cousin, 2 * Pi */
    $r = $pi / 180;             /* Degrees to radians */

    $circ = 2 * $pi * $er;      /* The circumference of the planet */
    
    // Convert the ZIP Code's latitude and longitude to radians

    $lat1 = $lat * $r;
    $lon1 = $lon * $r;

    // Calculate the number of degrees the requested radius subsumes.

    $delta = ( $twopi * $miles / $circ ) / $r;

    // And now the lower and upper latitudes it projects onto.

    $slat = $lat - $delta;
    $elat = $lat + $delta;

    // Binary search to find the first latitude table entry in the
    // list corresponding to our minimum (most southerly) latitude.

    $i0 = 0;
    $i1 = count( $lats );
    $limit = count( $lats );
    while ( ( $limit > 0 ) && ( ( $i1 - $i0 ) > 0 ) ) {

        $i = ( int ) ( ( $i0 + $i1 ) / 2 );

        $tlat = $lats[$i]->lat;
        if ( $tlat == $slat ) break;
        else if ( $tlat < $slat ) $i0 = $i;
        else $i1 = $i;

        $limit = $limit >> 1;

    }

    // Now compile the list of ZIP Codes within the radius requested.

    $ziplist = [];
    
    while ( $lats[$i]->lat <= $elat ) {

        foreach ( $lats[$i]->idx as &$idx ) {

            $zip = $zips->$idx;
            
            $lat2 = $zip->lat * $r;
            $lon2 = $zip->lon * $r;

            // Haversine distance.
            // See https://en.wikipedia.org/wiki/Haversine_formula

            $dist = 2 * $er *
                asin( sqrt( (sin( ( $lat2 - $lat1 ) / 2 ) )**2 +
                            cos( $lat2 ) * cos( $lat1 ) *
                            sin( ( ( $lon2 - $lon1 ) / 2 ) )**2 ) );

            // Is the distance less than or equal to our radius?
            // If so, append to the list.

            if ( $dist <= $miles ) $ziplist[] = "'" . $idx . "'";

        }
        $i++;

    }

    // Sort the list, just to make it more human readable.  There is
    // no reason to do this other than that.

    asort( $ziplist );

    // Build the query object to echo back what we were asked to do.
    // This is mostly for debugging and could probably be eliminated
    // from a production version with no particular detriment.

    $query = new stdClass();
    $query->zip = $zipcode;
    $query->miles = $miles;
    $query->zips = array_merge( $ziplist ); 
    $query->search_term = $search_term;

    // Paste it into the output array.

    $x = new stdClass();
    $x->query = $query;
    array_push( $json_data, $x );

    // Connect to the CTTI database.

    $dbconn = pg_connect(
        "host=aact-db.ctti-clinicaltrials.org " .
        "port=5432 " .
        "user=spl " .
        "dbname=aact " .
        "password=WaggaWocky@$>13" );

    // Everything okay?
    
    if ( !$dbconn ) {

        $status->state = "error";
        $status->message = 'Connect failed: ' . pg_last_error();

    } else {                    /* Yep. Let's create the DB query. */
        
        $query =
            "SELECT DISTINCT " .
            "ctgov.brief_summaries.nct_id" . 
            ",ctgov.brief_summaries.description" . 
            ",ctgov.studies.start_month_year" . 
            ",ctgov.studies.enrollment_type" . 
            ",ctgov.studies.overall_status" . 
            ",ctgov.central_contacts.name" . 
            ",ctgov.central_contacts.phone" . 
            ",ctgov.central_contacts.email" . 
            ",ctgov.eligibilities.criteria" . 
            " " . 
            "FROM ctgov.browse_conditions " . 
            "INNER JOIN ctgov.facilities " . 
            "ON ctgov.facilities.nct_id = ctgov.browse_conditions.nct_id " . 
            "INNER JOIN ctgov.studies " . 
            "ON ctgov.studies.nct_id = ctgov.browse_conditions.nct_id " . 
            "INNER JOIN ctgov.central_contacts " . 
            "ON ctgov.studies.nct_id = ctgov.central_contacts.nct_id " . 
            "INNER JOIN ctgov.eligibilities " . 
            "ON ctgov.studies.nct_id = ctgov.eligibilities.nct_id " . 
            "INNER JOIN ctgov.brief_summaries " . 
            "ON ctgov.brief_summaries.nct_id = ctgov.eligibilities.nct_id " . 
            "WHERE ctgov.browse_conditions.mesh_term = '" . 
            $search_term . "' and " . 
            "ctgov.studies.overall_status='Recruiting' and " . 
            "ctgov.facilities.zip = " .
            "any ( array[" . join( ",", $ziplist ) . "]);";

        // Fire off the query.
        
        $result = pg_query( $query );

        // Is there joy in Mudville?
        
        if ( !$result ) {       /* Nope. Mighty Casey has struck out. */

            $status->state = "error";
            $status->message = 'Query failed: ' . pg_last_error();

        } else {                /* Yep.  Play ball! */

            $studies = [];

            // Commutate through the results and compile the studies
            // array.

            while ( $line = pg_fetch_array( $result, null, PGSQL_ASSOC ) ) {

                $nct = new stdClass();

                $nct->NCT_number = $line['nct_id'];
                $nct->URL =
                    "https://clinicaltrials.gov/show/" . $line['nct_id'];
                $nct->study_description = $line['description'];
                $nct->start_date = $line['start_month_year'];
                $nct->enrollment_status = str_replace(
                    "Recruiting",
                    "Accepting Participants",
                    $line['overall_status'] );
                $nct->contact_name = $line['name'];
                $nct->contact_phone = $line['phone'];
                $nct->contact_email = $line['email'];
                $nct->eligibility_criteria = $line['criteria'];
         
                $studies[] = $nct;

            }

            // Paste the studies array into the output array.

            $data = new stdClass();
            $data->studies = $studies;
            $json_data[] = $data;

            // Affirm our status.

            $status->state = "ok";
            $status->query = $query;


            // Free result set.
            
            pg_free_result($result);

            // Close the database connection.
            
            pg_close($dbconn);

        }
        
    }
    
}

// Create the status object for and append it.

$statobj = new stdClass();
$statobj->status = $status;
$x = new stdClass();
$x->status = $statobj;

array_splice( $json_data, 0, 0, $x );

// Return the results so everyone can enjoy them.

echo json_encode( $json_data );

?>
