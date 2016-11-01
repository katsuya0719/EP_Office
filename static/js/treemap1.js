d3.csv('static/csv/trafficSources.csv', function(csv){
    csv = csv.slice(0, 15); //表示する参照元を15件に絞り込み
 
    var data = { children:csv }; //csvから取得したデータを全てrootの配下(children)に追加する

    console.log(data)
    
    var svg = d3.select('#tree-map');  //TreeMapを描画するステージを選択
                        
    //Treemapのboxサイズに対応させる要素を指定
    var retVisits = function(d){ return parseInt(d.Visits) };
    var retNew_Visits = function(d){ return parseInt(d.New_Visits.replace('%', '')) };　//「新規訪問者の割合」は%を削除して数値に変換する

    console.log(retVisits())
 
    var w = 1000;   
    var h = 600; 
 
    var treemap = d3.layout.treemap().size([w, h]); //Treemapレイアウトオブジェクトを作成。Treemapのサイズ(縦横)を指定
    var TreemapData = treemap.value(retVisits).nodes(data); //Visitsの値を基準にTreemap用のデータに変換する
 
    var boxStyle = { //boxスタイル指定
        x:F('x'),
        y:F('y'),
        width:F('dx'),
        height:F('dy')  
    }
    
    var boxColorStyle = function(d){　//参照元のジャンル別にfillcolorを指定
        var color = "blue";
        switch(d.Source){
            case 'yahoo':
            case 'google.co.jp':
            case 'google':color = 'green';break;
            case 'facebook.com':
            case 'm.facebook.com':
            case 't.co': 
            case 'b.hatena.ne.jp':color = 'red';break;
        }
        return color
    }
    
    
    var boxGroup = svg.selectAll("g") //Boxグループを追加
        .data(TreemapData) 
        .enter()
        .append("g"); 
 
    var box =  boxGroup.append('rect') //各BoxをBoxグループに追加
        .attr({
            class:F('Source'),
            fill:boxColorStyle, 
            stroke: "black",
            "fill-opacity": 0.5
        })
        .attr(boxStyle)
 
    var textStyle = { //ラベルスタイル指定
        x:F('x', ' + 5'),
        y:F('y', ' + 20')
    }
 
    var text = boxGroup.append('text') //ラベル追加
        .attr({
            fill:"white",
            "font-size": 12
        })
        .attr(textStyle)
        .text(F('Source')); //参照元(Source)を表示
 
 
    var style1 = function(){ //訪問者数(Visits)を基準としたスタイル
        boxGroup.data(treemap.value(retVisits).nodes(data));
        box.transition().attr(boxStyle).duration(1000);
        text.transition().attr(textStyle).duration(1000);    
    }
    var style2 = function(){ //新規訪問者数の割合(New_Visits)を基準としたスタイル
        boxGroup.data(treemap.value(retNew_Visits).nodes(data));
        box.transition().attr(boxStyle).duration(1000);
        text.transition().attr(textStyle).duration(1000);    
    }
 
    //ボタンクリックイベントの設定
    d3.select('#Visits_btn').on('click', style1)
    d3.select('#New_Visits_btn').on('click', style2)
});