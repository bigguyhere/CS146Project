    //Constant that translates the values of the choices of the user into the options they chose
    const frequency = {
        1: "Very Often (6-7 days a week)",
        2: "Often (4-5 days a week)",
        3: "Somewhat Often (2-3 days a week)",
        4: "Never (0-1 day a week)"
    };

    var currID;
    var Qnum;
    /**
     * Adds an event listener to the id="quiz" form
     * Checks the radio button labelled Hide Detailed Results
     * trys to load the attempt id
     */
    window.onload = () => {
        document.getElementById("quiz").addEventListener("submit", hideQuiz);
        document.getElementById("Hide").checked = true;
        currID = loadID();
        incID();
        document.getElementById("selectorMessage").style.display = "none";
    }

    /**
     * Hides the quiz from the user
     * Displays the Hide and Show Detailed Results radio buttons
     * Calls determineResults to find the results of the quiz
     * Calls createTable to create the detailed results of the quiz
     * Creates the h2 element that displays the results of the quiz
     * Changes the message on the h3 element based on the results of the quiz
     * @param {Event} event the submit event of the id="quiz" form
     */
    function hideQuiz(event) {
        //Prevents page reload
        event.preventDefault();

        var quiz = document.getElementById("quiz");
        var data = new FormData(quiz);
        var detailedResults = document.getElementsByTagName("table")[0];
        var newForm = document.getElementsByClassName("hidden")[0];
        
        quiz.style.display = "none";
        newForm.style.display = "initial";
        
        var results = determineResults(data);
        storeResult(results);
        storeTable(data);

        createTable(data, detailedResults, results);

        var h2 = document.createElement("h2");
        h2.id = "results";
        h2.textContent = "Your Results are: " +  (Math.round(results* 100)) + "%";
        newForm.appendChild(h2);

        var h3 = document.createElement("h3");
        h3.id = "message";
        
        if(results > 2/3)
            h3.textContent = "You are most likely suffering from " + document.getElementsByTagName("body")[0].id + ". Please contanct CAPS immediately at caps@stevens.edu OR 201.216.5177.";
        else if(results > 1/3)
            h3.textContent = "You are mostly likely suffering from mild " + document.getElementsByTagName("body")[0].id + ". We recommend you come into CAPS the next time you're free."
        else
            h3.textContent = "You most likely have little to no symptoms of " + document.getElementsByTagName("body")[0].id + ". There is no need for you to come into the CAPS offices."

        newForm.appendChild(h3);
        gatherForms();
        document.getElementById("selectorMessage").style.display = "inline";
    }

    /**
     * Helper for updating the results
     * @param id the attempt id to track past attempts
     */
    function refresh(id){
        updateValues(loadTable(id),loadResult(id));
    }
    
    /**
     * Gets from local storage to read the id of the current form attempt
     * Returns the id
     */
    function loadID(){
        var id;
        id = window.localStorage.getItem('id');

        if (id == null){
            window.localStorage.setItem('id', '0');
            id = '0';
        }

        return id;
    }
    /**
     * Increments and stores in local storage the current id
     */
    function incID(){
        var numID = parseInt(currID) + 1;
        currID = numID.toString();
        window.localStorage.setItem('id', currID);
    }

    /**
     * Stores in local storage the value of the result of the current form attempt
     * @param result the results of the FormData quiz
     */
    function storeResult(result){
        var name = currID + ' ' + document.getElementsByTagName("body")[0].id;
        window.localStorage.setItem(name, result.toString());
    }
    /**
     * Gets from local storage to read the result of a specific form attempt
     * Returns the result
     * @param id the attempt id to track past attempts
     */
    function loadResult(id){
        var name = id + ' ' + document.getElementsByTagName("body")[0].id;
        return window.localStorage.getItem(name);
    }

    /**
     * Stores in local storage the values of the answers of the current form attempt
     * @param {FormData} form the FormData of the quiz
     */
    function storeTable(form){
        //store
        Qnum = 0;

        for(var pair of form.entries())
        {
            if(pair[0] != "name" && pair[0] != "cwid")
            {
                var name = currID + ' ' + document.getElementsByTagName("body")[0].id + ' ' + pair[0];
                window.localStorage.setItem(name, pair[1]);
                Qnum += 1;
            }
        }
    }

    /**
     * Gets from local storage to read the answers of a specific form attempt
     * Returns a dictionary of the answers
     * @param id the attempt id to track past attempts
     */
    function loadTable(id){
        var answers = {};
        for (i = 0; i < Qnum; i++)
        {
            var name = id + ' ' + document.getElementsByTagName("body")[0].id + ' ' + "Q" + (i + 1).toString() + "answers";
            var ans = window.localStorage.getItem(name);
            answers[name] = ans;
        }
        return answers;
    }

    /**
     * Creates a header that includes the user's name and cwid
     * Adds to the table a set of pairs of Question and Answer blocks
     * Adds to the final results of the quiz
     * @param {FormData} form the FormData of the quiz
     * @param {HTMLTableElement} table the table createTable will be expanding upon
     * @param result the results of the FormData quiz
     */
    function createTable(form, table, result){

        var header = document.createElement("th");
        header.textContent = form.get("name") + "'s Results (CWID: " + form.get("cwid") + ")";
        var newRow = document.createElement("tr");
        table.appendChild(newRow);
        newRow.appendChild(header);

        for(var pair of form.entries())
        {
            if(pair[0] != "name" && pair[0] != "cwid")
            {
                var newTD = document.createElement("td");
                newTD.id = 'ans for ' + pair[0];
                var questionNum = document.createElement("td");
                var newRow = document.createElement("tr");

                newTD.textContent = frequency[pair[1]];
                questionNum.textContent = "Question " + pair[0].charAt(1) + ":";

                newRow.appendChild(questionNum);
                newRow.appendChild(newTD);
                table.appendChild(newRow);
            }
        }

        var results = document.createElement("td");
        results.id = 'result';
        var resultHeader = document.createElement("td");
        var newRow = document.createElement("tr");

        results.textContent = Math.round(result * 100) + "%";
        resultHeader.textContent = "Results:";

        newRow.appendChild(resultHeader);
        newRow.appendChild(results);
        table.appendChild(newRow);
    }

    /**
     * Updates the result page
     * @param QnA the dictionary with question and answer pairs Q&A
     * - key is in the form: id selectedPage questionNum
     * @param result the results of the FormData quiz
     */
    function updateValues(QnA,result){
        //update result percent
        res = document.getElementById('result');
        res.textContent = Math.round(parseFloat(result) * 100) + "%";
        h2 = document.getElementById('results');
        h2.textContent = "Your Results are: " + Math.round(parseFloat(result) * 100) + "%";

        //update message
        var h3 = document.getElementById("message");
        
        if(parseFloat(result) > 2/3)
            h3.textContent = "You are most likely suffering from " + document.getElementsByTagName("body")[0].id + ". Please contanct CAPS immediately at caps@stevens.edu OR 201.216.5177.";
        else if(parseFloat(result) > 1/3)
            h3.textContent = "You are mostly likely suffering from mild " + document.getElementsByTagName("body")[0].id + ". We recommend you come into CAPS the next time you're free."
        else
            h3.textContent = "You most likely have little to no symptoms of " + document.getElementsByTagName("body")[0].id + ". There is no need for you to come into the CAPS offices."

        //update answers
        for (var key in QnA){
            var Qs = key.split(' ');
            ans = document.getElementById('ans for ' + Qs[2]);
            ans.textContent = frequency[QnA[key]];
        }
    }

    /**
     * Finds and displays the submissions for the selected quiz in the selector
     */
    function gatherForms(){

        var select = document.getElementById("selector");
        var formCounter = 1;

        //add forms
        for (var i = 0; i < currID; i++){
            var storedFormQ1 = window.localStorage.getItem( (i + 1).toString() + ' ' + document.getElementsByTagName("body")[0].id + ' ' + "Q1answers");
            if (storedFormQ1 != null){
                var option = document.createElement("option");
                option.value = (i + 1).toString();
                option.textContent = (formCounter).toString();
                select.appendChild(option);
                formCounter += 1;
            }
        }
        
    }
    
    /**
     * Finds and Removes the submissions for the selected quiz in the selector
     */
    function clearForms(){

        var select = document.getElementById("selector");
        var options = select.childNodes;

        //add forms
        for (var i = 1; i <= currID; i++){
            var storedFormQ1 = window.localStorage.getItem( i.toString() + ' ' + document.getElementsByTagName("body")[0].id + ' ' + "Q1answers");
            if (storedFormQ1 != null && i != currID){
                options[0].remove();
                for (var j = 1; j <= Qnum; j++){
                    window.localStorage.removeItem( i.toString() + ' ' + document.getElementsByTagName("body")[0].id + ' ' + "Q" + j.toString() + "answers");
                }
            }
            else if (i == currID){
                options[0].textContent = '1';
            }
        }
        
    }

    /**
     * Determines the results of the quiz given from FormData form
     * @param {FormData} form the FormData of the quiz
     */
    function determineResults(form){
        var results = 0, totalQuestions = 0;

        for(var pair of form.entries())
        {
            if(pair[0] != "name" && pair[0] != "cwid")
            {
                results += parseInt(pair[1]) - 1;
                totalQuestions++;
            }
        }

        return 1 - results / (totalQuestions * 3);
    }

    /**
     * Shows the table displaying detailed results
     * Hides the h2 with id="results"
     */
    function showTable(){
        var th = document.getElementsByTagName("th");
        var td = document.getElementsByTagName("td");

        document.getElementById("results").style.display = "none";
        document.getElementsByTagName("table")[0].style.display = "table";

        for(var i = 0; i < th.length; i++){
            th[i].style.display = "table";
        }
        for(var i = 0; i < td.length; i++){
            td[i].style.display = "table";
        }
    }

    /**
     * Hides the table displaying detailed results
     * Shows the h2 with id="results"
     */
    function hideTable(){
        document.getElementsByTagName("table")[0].style.display = "none";
        document.getElementById("results").style.display = "initial";
    }