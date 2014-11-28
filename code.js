var intervalRef;
var Height;
var Width;
var deadBoardHash;
var hashHistory;

$(document).ready(function ()
{
    hashHistory = [];
    ResetBoard(120, 180);

    $("#start").on('click', function ()
    {
        DoGeneration();

        intervalRef = setInterval(function ()
        {
            DoGeneration();
        },
        120);
    });

    $("#singleGen").on('click', function ()
    {
        DoGeneration();
    });

    $("#stop").on('click', function ()
    {
        clearInterval(intervalRef);
    });

    $("#reset").on('click', function ()
    {
        ResetBoard(Height, Width);
    });

    $("#clear").on('click', function ()
    {
        $(".cell").removeClass('alive dead').addClass('dead');
    });

    $(document).on('click', ".cell", function ()
    {
        // manually toggle the cell state
        $(this).toggleClass("dead alive");
    });
});

function ResetBoard(height, width)
{
    Height = height;
    Width = width;
    var currentBoardHasInput = "";
    var deadBoardHashInput = "";

    var html = "";
    var random = 0;
    for (var row = 0; row < height; row++)
    {
        html += "<tr>";
        for (var col = 0; col < width; col++)
        {
            html += '<td id="c' + row + '_' + col + '" class="cell ';
            random = Math.floor(Math.random() * 10);
            if (random < 7)
            {
                html += 'dead';
                currentBoardHasInput += "0";
            }
            else
            {
                html += 'alive';
                currentBoardHasInput += "1";
            }
            
            html += '"></td>';

            deadBoardHashInput += "0";
        }
        html += "</tr>";
    }
    deadBoardHash = deadBoardHashInput.hashCode();

    // Add hash to the stack
    var boardHash = currentBoardHasInput.hashCode();
    hashHistory.push(boardHash);
    $("#status").html(boardHash);

    $("#board").html(html);
    $("#generation").val("0");
}

function DoGeneration()
{  
    // Calculate next state for each cell
    $(".cell").each(function ()
    {
        DetermineNextCellState(this);
    });

    // Set each cell to next state
    var boardHashInput = "";
    $(".cell").each(function ()
    {
        $(this).removeClass('alive dead');
        $(this).addClass(this.NextState);
        if(this.NextState == 'alive')
        {
            boardHashInput += "1";
        }
        else
        {
            boardHashInput += "0";
        }
    });

    var boardHash = boardHashInput.hashCode();
    $("#status").html(boardHash);

    // Check to see if the board is dead
    if (boardHash == deadBoardHash)
    {
        clearInterval(intervalRef);
        $("#status").html('All cells dead, stopped doing generations');
        return;
    } 

    // Add hash to the stack
    hashHistory.push(boardHash);

    // Check for 1-2-1-2 pattern
    if (hashHistory.length > 3)
    {
        if(hashHistory[0] == hashHistory[2]
            && hashHistory[1] == hashHistory[3])
        {
            clearInterval(intervalRef);
            $("#status").html('Stable 2 cycle state detected.');
        }
        while(hashHistory.length > 4)
        {
            hashHistory.shift();
        }
    }

    // Increment generation
    var gen = $("#generation");
    var num = parseInt(gen.val());
    gen.val(++num);
}

function DetermineNextCellState(cell)
{
    // How many living neighbors does it have?
    // Extract the Row and Col numbers
    var nums = $(cell).attr("id").replace('c','').split('_');
    var row = parseInt(nums[0]);
    var col = parseInt(nums[1]);

    // Determine the row and column indexes we will be working with
    var rowIndexes = [row - 1, row, row + 1];
    var colIndexes = [col - 1, col, col + 1];
    // Wrap around cells
    if (row == 0)
    {
        rowIndexes[0] = Height - 1;
    }
    if (row == (Height-1))
    {
        rowIndexes[2] = 0;
    }
    if (col == 0)
    {
        colIndexes[0] = Width - 1;
    }
    if (col == (Width - 1))
    {
        colIndexes[2] = 0;
    }

    // Get the neighboring cells
    var neighbors = 0;
    for (var r = 0; r < 3; r++)
    {
        for (var c = 0; c < 3; c++)
        {
            if (!(c == 1 && r == 1)) // not the current cell
            {
                if ($("#c" + rowIndexes[r] + '_' + colIndexes[c]).hasClass("alive"))
                {
                    neighbors++;
                }
            }
        }
    }

    if ($(cell).hasClass("alive"))
    {
        cell.NextState = 'alive';
        if (neighbors < 2 || neighbors > 3)
        {
            cell.NextState = 'dead';
        }
    }
    else
    {
        cell.NextState = 'dead';
        //if (neighbors == 3 || neighbors == 6 || neighbors == 5) // "high life" version of life
        if (neighbors == 3)
        {
            cell.NextState = 'alive';
        }
    }
}

// Hash function to help compare board states
String.prototype.hashCode = function ()
{
    var hash = 0, i, chr, len;
    if (this.length == 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
