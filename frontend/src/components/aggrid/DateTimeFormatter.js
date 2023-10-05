

export default ({type,blaStuff}) => {
    switch(type) {

        case 'date':
            return params => {

                // korrekter weg um vom ISO String zum lokal date zu kommen

                // console.log(params)
                // console.log(params.colDef.headerName)

                if(typeof params === 'undefined' || params == null || typeof params.value === 'undefined' || params.value == null) {
                    return undefined
                }

                let date = new Date(params.value)       // Der ISO String wird geparst und nach local umgerechnet, d.h. die Zeitzone fliegt raus

                let day = date.getDate()
                let month = date.getMonth() + 1
                let year = date.getFullYear()

                if(isNaN(day) || isNaN(month) || isNaN(year)) {
                    return undefined
                }

                if (day < 10) {
                  day = '0' + day;
                }

                if (month < 10) {
                    month = '0' + month;
                }

                let formatted = day + '.' + month + '.' + year

                return formatted
            }
            
        case 'datetime':
        case 'time':
        default:
            return params => "value formatter not implemented"
    }
}
