    //Constant that translates the values of the choices of the user into the options they chose
    const frequency = {
        1: "Very Often (6-7 days a week)",
        2: "Often (4-5 days a week)",
        3: "Somewhat Often (2-3 days a week)",
        4: "Never (0-1 day a week)"
    };

    /**
     * Adds an event listener to the id="quiz" form
     * Checks the radio button labelled Hide Detailed Results
     */
    window.onload = () => {
        document.getElementById("quiz").addEventListener("submit", hideQuiz);
        document.getElementById("Hide").checked = true;
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
        var resultHeader = document.createElement("td");
        var newRow = document.createElement("tr");

        results.textContent = Math.round(result * 100) + "%";
        resultHeader.textContent = "Results:";

        newRow.appendChild(resultHeader);
        newRow.appendChild(results);
        table.appendChild(newRow);
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

        return 1 - results / (totalQuestions * 3)
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