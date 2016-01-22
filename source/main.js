'use strict';
var d3 = require('d3');

d3.json('http://bertha.ig.ft.com/republish/publish/ig/1cK_6tLZ529IpgxGElH5H0BOrx_IvPVy_uITaDVhvj9o',
    function(sheets){
        var questions = Object.keys(sheets.options);
        
        function calculate(){
            //get all the input values
            var values = {}
            d3.selectAll('input[type="range"]')
                .each(function(d){
                    var value = this.value; 
                    if(value == -1) values[d] = false;
                    if(value == 1) values[d] = true;
                });
            
            d3.selectAll('.slider')
                .attr('class',function(d){
                    var value = d3.select(this).select('input[type="range"]').node().value;
                    if(value == -1) return ('slider no')
                    if(value == 1) return ('slider yes')
                    return 'slider';
                });   

            //get the outcome list and for each one check whether it's still active
            var chosen = Object.keys(values);
            var viable = [];
            
            d3.selectAll('.outcome')
                .attr('class', function(d){
                    var active = 'active';
                    //for every decision the user has made, compare with the outcome.
                    chosen.forEach(function(q){
                        if(values[q] !== d[q]) active = 'inactive';
                    })
                    if(active === 'active'){
                        viable.push(d);
                    }
                    //if there is a difference the options is ruled out
                    return ('outcome ' + active)
                });
            if(viable.length === 1){
                showDetails(viable[0])
            }else{
                d3.selectAll('.details').remove();
            }
        }
        
        function showDetails(d){
            d3.select('.outputs').selectAll('.details')
                .data([d])
                .enter().append('div')
                    .attr({
                        'class':'details'
                    })

                    
           d3.select('.outputs').selectAll('.details')
                .html(
                    '<h3>Pros</h3>'
                    +'<p>'+d.upside+'</p>'
                    +'<h3>Cons</h3>'
                    +'<p>'+d.downside+'</p>'
                    +'<h3>Likelihood</h3>'
                    +'<p>'+d.probability+'</p>');
        }
        
        //remove the loading text
        d3.selectAll('.loading').remove();
        
        //create inputs and outputs
        d3.select('.inputs')
            .selectAll('div.input')
            .data(questions)
                .enter()
            .append('div')
                .attr({
                    'class':'input'
                }).text(function(d){ return sheets.options[d]; })
            .append('div')
                .attr('class','slider')
            .call(function(selection){
                selection.append('span').attr('class','no').text('no');
                
                selection.append('input')
                    .attr({
                        id:function(d){ return 'input-' + d; },
                        type:'range',
                        min:-1,
                        max:1,
                        step:1
                    })
                    .on('change', calculate);
                    
                selection.append('span').attr('class','yes').text('yes');
            });
        
        d3.select('.outputs')
            .selectAll('.outcome')
            .data( sheets.data )
                .enter()
            .append('div')
                .attr({
                    'class':function(d){
                        return 'outcome active';
                    }
                })
                .text(function(d){

                    return d.model;
                })
                .on('click', function(e){
                    //set all the question sliders to match the datum
                    d3.selectAll('input[type="range"]')
                        .each(function(d){
                            if(e[d]){
                                this.value = 1;
                            }else{
                                this.value = -1;
                            }
                        });
                    calculate();
                });
                
        d3.selectAll('.reset')
            .on('click', function(){
                d3.selectAll('input[type="range"]')
                    .each(function(){
                        this.value = 0;
                    });
                
                calculate();
            })
             
           
    });

