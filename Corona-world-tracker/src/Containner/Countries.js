import React from 'react'
import './Countries.css'
class Countries extends React.Component{

    render(){
        const {countries} =this.props;
        console.log(countries)
        return(
            <div className="container Table"  style={{marginTop:"60px"}}>  
               <div className="tbl-header">
                    <table cellPadding="0" cellSpacing="0" border="0" >
                  <thead>
                    <tr>
                        <th><strong>Country</strong></th>
                        <th><strong>Total Cases</strong></th>
                        <th><strong>New Cases</strong></th>
                        <th><strong>Total Deaths</strong></th>
                        <th><strong>New Deaths</strong></th>
                        <th><strong>Total Recovered</strong></th>
                        <th><strong>Active Cases</strong></th>
                        <th><strong>Serious Critical</strong></th>
                        <th><strong>TotCases/1M Pop</strong></th>
                        <th><strong>Deaths/1M pop</strong></th>
                        <th><strong>Total Tests</strong></th>
                        <th><strong>Tests/1M Pop</strong></th>
                    </tr>
                    </thead>
                    </table>
                </div>
                <div className="tbl-content">
                    <table cellPadding="0" cellSpacing="0" border="0">
                    <tbody className="Table" >
                    {countries.map((data, index) => {
                     return <tr key={(index)} >
                      <td><strong>{data.Country}</strong></td>
                      <td><strong>{data.TotalCases}</strong></td>
                      <td ><strong>{data.NewCases}</strong></td>
                      <td><strong>{data.TotalDeaths}</strong></td> 
                      <td style={{color:"#ff1919",fontWeight: 300}}><strong>{data.NewDeaths}</strong></td>
                      <td><strong>{data.TotalRecovered}</strong></td> 
                      <td><strong>{data.ActiveCases}</strong></td>
                      <td><strong>{data.Serious_Critical}</strong></td> 
                      <td><strong>{data.TotCases_1M_Pop}</strong></td> 
                      <td><strong>{data.Deaths_1M_pop}</strong></td>
                      <td><strong>{data.TotalTests}</strong></td>
                      <td><strong>{data.Tests_1M_Pop}</strong></td>                            
                   </tr>
                   })}      
                    </tbody>
                    </table>
                </div>
            </div>
            
        )
    }

}
export default Countries;