export default function( value ) {
  let withoutAt          = value.replace( '@', '' ),
      withoutPunctuation = withoutAt.replace( /[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '' );

  return withoutPunctuation.toLowerCase().trim();
}
