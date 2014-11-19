var intervalRef;
var Height;
var Width;

$(document).ready(function ()
{
    ResetBoard(35, 60);

    $("#start").on('click', function ()
    {
        DoGeneration();

        intervalRef = setInterval(function ()
        {
            DoGeneration();
        },
        150);
    });

    $("#stop").on('click', function ()
    {
        clearInterval(intervalRef);
    });

    $("#reset").on('click', function ()
    {
        ResetBoard(Height, Width);
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

    var html = "";
    var random = 0;
    for (var row = 0; row < height; row++)
    {
        html += "<tr>";
        for (var col = 0; col < width; col++)
        {
            html += '<td id="c' + row + '_' + col + '" class="cell ';
            random = Math.floor(Math.random() * 10);
            if (random < 4)
            {
                html += 'dead';
            }
            else
            {
                html += 'alive';
            }
            
            html += '"></td>';
        }
        html += "</tr>";
    }
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
    $(".cell").each(function ()
    {
        $(this).removeClass('alive dead');
        $(this).addClass(this.NextState);
    });

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

    if ($(this).hasClass("alive"))
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
        if (neighbors == 3 || neighbors == 6 || neighbors == 5)
        {
            cell.NextState = 'alive';
        }
    }
}