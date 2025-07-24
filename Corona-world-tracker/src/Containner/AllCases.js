import React, { PureComponent } from 'react';
import './Allcase.css';

class AllCases extends PureComponent {
    render() {
        const { summary } = this.props;
        
        if (!summary) {
            return (
                <div className="jumbotron container" style={{textAlign: "center"}}>
                    Loading summary data...
                </div>
            );
        }

        return (
            <div className="jumbotron container">   
                {/* Replaced deprecated marquee with CSS animation */}
                <div 
                    className="scroll-text" 
                    style={{
                        fontSize: "20px",
                        color: "#eb3434",
                        marginTop: "-20px",
                        textAlign: "center",
                        fontWeight: "bold"
                    }}
                >
                    This portal is updated every 24 hours
                </div>    
                <div className="jumbotron container">           
                    <div className="d-flex justify-content-around mb-3">
                        <div className="p-2 all-cases">
                            <h2>Coronavirus Cases</h2>
                            <h2 style={{letterSpacing: "2px"}}>{summary.cases || 'N/A'}</h2>
                        </div>
                        <div className="p-2 deaths">
                           <h2 style={{fontFamily: "Verdana"}}>Deaths</h2>
                            <h2 style={{color: "white", letterSpacing: "2px"}}>{summary.deaths || 'N/A'}</h2>
                        </div>
                        <div className="p-2 recovered">
                            <h2 style={{fontFamily: "Verdana"}}>Recovered</h2>
                            <h2 style={{letterSpacing: "2px"}}>{summary.recovered || 'N/A'}</h2> 
                        </div>
                    </div>
                </div>    
            </div>    
        );
    }
} 
export default AllCases;