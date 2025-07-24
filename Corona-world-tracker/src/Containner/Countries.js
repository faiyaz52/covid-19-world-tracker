import React, { PureComponent } from 'react';
import './Countries.css';

class Countries extends PureComponent {
    render() {
        const { countries } = this.props;
        
        if (!countries || countries.length === 0) {
            return (
                <div className="container" style={{textAlign: "center", padding: "20px"}}>
                    No country data available
                </div>
            );
        }
        
        return (
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
                    <tbody className="Table">
                    {countries.map((data, index) => (
                        <tr key={data.Country || index}>
                            <td><strong>{data.Country || 'N/A'}</strong></td>
                            <td><strong>{data.TotalCases || '0'}</strong></td>
                            <td><strong>{data.NewCases || '0'}</strong></td>
                            <td><strong>{data.TotalDeaths || '0'}</strong></td> 
                            <td style={{color:"#ff1919", fontWeight: 300}}>
                                <strong>{data.NewDeaths || '0'}</strong>
                            </td>
                            <td><strong>{data.TotalRecovered || '0'}</strong></td> 
                            <td><strong>{data.ActiveCases || '0'}</strong></td>
                            <td><strong>{data.Serious_Critical || '0'}</strong></td> 
                            <td><strong>{data.TotCases_1M_Pop || '0'}</strong></td> 
                            <td><strong>{data.Deaths_1M_pop || '0'}</strong></td>
                            <td><strong>{data.TotalTests || '0'}</strong></td>
                            <td><strong>{data.Tests_1M_Pop || '0'}</strong></td>                            
                        </tr>
                    ))}
                    </tbody>
                    </table>
                </div>
            </div>
            
        )
    }

}
export default Countries;