using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Text;
using System.Data.Common;
using serverSide.BL;
using System.Dynamic;
using Microsoft.AspNetCore.Mvc.ViewEngines;

/// <summary>
/// DBServices is a class created by me to provides some DataBase Services
/// </summary>
public class DBservicesBooks
{

    public DBservicesBooks() { }

    //--------------------------------------------------------------------------------------------------
    // This method creates a connection to the database according to the connectionString name in the web.config 
    //--------------------------------------------------------------------------------------------------
    public SqlConnection connect(String conString)
    {

        // read the connection string from the configuration file
        IConfigurationRoot configuration = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json").Build();
        string cStr = configuration.GetConnectionString("myProjDB");
        SqlConnection con = new SqlConnection(cStr);
        con.Open();
        return con;
    }

    //--------------------------------------------------------------------------------------------------
    // This method adds a new book to the books table 
    //--------------------------------------------------------------------------------------------------
    public int AddNewBook(Book book)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        cmd = CreateCommandWithStoredProcedureAddNewBook("AddNewBook", con, book);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }


    //---------------------------------------------------------------------------------
    // Create the SqlCommand using a stored procedure to add new book
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProcedureAddNewBook(String spName, SqlConnection con, Book book)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@title", book.Title);

        cmd.Parameters.AddWithValue("@subTitle", book.SubTitle);

        cmd.Parameters.AddWithValue("@isEbook", book.IsEbook);

        cmd.Parameters.AddWithValue("@price", book.Price);

        cmd.Parameters.AddWithValue("@category", book.Category);

        cmd.Parameters.AddWithValue("@smallThumbnail", book.SmallThumbnail);

        cmd.Parameters.AddWithValue("@Thumbnail", book.Thumbnail);

        cmd.Parameters.AddWithValue("@numOfPages", book.NumOfPages);

        cmd.Parameters.AddWithValue("@description", book.Description);

        cmd.Parameters.AddWithValue("@previewLink", book.PreviewLink);

        cmd.Parameters.AddWithValue("@publishedDate", book.PublishDate);

        cmd.Parameters.AddWithValue("@firstAuthor", book.FirstAuthorName);

        cmd.Parameters.AddWithValue("@SecondAuthor", book.SecondAuthorName);

        cmd.Parameters.AddWithValue("@rating", book.Rating);

        cmd.Parameters.AddWithValue("@numOfReviews", book.NumOfReviews);

        cmd.Parameters.AddWithValue("@textSnippet", book.TextSnippet);


        return cmd;
    }


    //--------------------------------------------------------------------------------------------------
    // This method show all  books 
    //--------------------------------------------------------------------------------------------------

    public List<object> getAllBooks()

    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        cmd = CreateCommandWithStoredProcedureGetBooks("getAllBooks", con);             // create the command


        List<dynamic> Books = new List<dynamic>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                dynamic book = new ExpandoObject();
                book.Id = Convert.ToInt32(dataReader["id"]);
                book.Title = Convert.ToString(dataReader["title"]);
                book.SubTitle = Convert.ToString(dataReader["subTitle"]);
                book.IsEbook = Convert.ToByte(dataReader["isEbook"]);
                book.IsActive = Convert.ToByte(dataReader["isActive"]);
                book.IsAvailable = Convert.ToByte(dataReader["isAvailable"]);
                book.Price = (float)Convert.ToDouble(dataReader["price"]);
                book.Category = Convert.ToString(dataReader["category"]);
                book.SmallThumbnail = Convert.ToString(dataReader["smallThumbnail"]);
                book.Thumbnail = Convert.ToString(dataReader["thumbnail"]);
                book.NumOfPages = Convert.ToInt32(dataReader["numOfPages"]);
                book.Description = Convert.ToString(dataReader["description"]);
                book.PreviewLink = Convert.ToString(dataReader["previewLink"]);
                book.PublishDate = Convert.ToString(dataReader["publishedDate"]);
                book.FirstAuthorName = Convert.ToString(dataReader["firstAuthor"]);
                book.SecondAuthorName = Convert.ToString(dataReader["secondAuthor"]);
                book.NumOfReviews = Convert.ToInt32(dataReader["numOfReviews"]);
                book.Rating = (float)Convert.ToDouble(dataReader["rating"]);
                book.TextSnippet = Convert.ToString(dataReader["textSnippet"]);
                book.UserName = Convert.ToString(dataReader["userName"]);

                book.UserId = Convert.ToString(dataReader["userid"]);
                book.IsRead = Convert.ToString(dataReader["isRead"]);

                // if no user bought the book
                if (book.UserId == "" || book.IsRead == "") { }

                else // if someone bought the book
                {
                    book.UserId = Convert.ToInt32(dataReader["userid"]);
                    book.IsRead = (Convert.ToInt32(dataReader["isRead"]) == 1);
                }

                Books.Add(book);

            }
            return Books;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }


    //---------------------------------------------------------------------------------
    // Create the SqlCommand using a stored procedure to get books 
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProcedureGetBooks(String spName, SqlConnection con)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text


        return cmd;
    }
    //--------------------------------------------------------------------------------------------------
    // This method let the user rate books
    //--------------------------------------------------------------------------------------------------

    public int RateBook(int bookID, int newRating, int userID, string review)
    {

        SqlConnection con;
        SqlCommand cmd;
        SqlParameter returnValue = new SqlParameter();


        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        cmd = CreateCommandWithStoredProcedureNewRating("RateBook", con, bookID, newRating, userID, review);             // create the command
        returnValue.ParameterName = "@RETURN_VALUE";
        returnValue.Direction = ParameterDirection.ReturnValue;
        cmd.Parameters.Add(returnValue);
        try
        {
            cmd.ExecuteNonQuery(); // execute the command
            int numEffected = (int)cmd.Parameters["@RETURN_VALUE"].Value;
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }


    //---------------------------------------------------------------------------------
    //  This method let the user rate books
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProcedureNewRating(String spName, SqlConnection con, int bookId, int newRating, int userId, string review)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text


        cmd.Parameters.AddWithValue("@bookid", bookId);
        cmd.Parameters.AddWithValue("@newRating", newRating);
        cmd.Parameters.AddWithValue("@userid", userId);
        cmd.Parameters.AddWithValue("@review", review);




        return cmd;
    }
    //--------------------------------------------------------------------------------------------------
    // This method show top 5 books by rating 
    //--------------------------------------------------------------------------------------------------

    public List<object> getTop5BooksByRating()

    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        cmd = CreateCommandWithStoredProceduregetTop5BooksByRating("GetTop5Books", con);             // create the command


        List<dynamic> Books = new List<dynamic>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                dynamic book = new ExpandoObject();
                book.Id = Convert.ToInt32(dataReader["id"]);
                book.Title = Convert.ToString(dataReader["title"]);
                book.SubTitle = Convert.ToString(dataReader["subTitle"]);
                book.IsEbook = Convert.ToByte(dataReader["isEbook"]);
                book.IsActive = Convert.ToByte(dataReader["isActive"]);
                book.IsAvailable = Convert.ToByte(dataReader["isAvailable"]);
                book.Price = (float)Convert.ToDouble(dataReader["price"]);
                book.Category = Convert.ToString(dataReader["category"]);
                book.SmallThumbnail = Convert.ToString(dataReader["smallThumbnail"]);
                book.Thumbnail = Convert.ToString(dataReader["thumbnail"]);
                book.NumOfPages = Convert.ToInt32(dataReader["numOfPages"]);
                book.Description = Convert.ToString(dataReader["description"]);
                book.PreviewLink = Convert.ToString(dataReader["previewLink"]);
                book.PublishDate = Convert.ToString(dataReader["publishedDate"]);
                book.FirstAuthorName = Convert.ToString(dataReader["firstAuthor"]);
                book.SecondAuthorName = Convert.ToString(dataReader["secondAuthor"]);
                book.NumOfReviews = Convert.ToInt32(dataReader["numOfReviews"]);
                book.Rating = (float)Convert.ToDouble(dataReader["rating"]);
                book.TextSnippet = Convert.ToString(dataReader["textSnippet"]);

                Books.Add(book);
            }
            return Books;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }


    //---------------------------------------------------------------------------------
    // Create the SqlCommand using a stored procedure to get TOP 5 books 
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProceduregetTop5BooksByRating(String spName, SqlConnection con)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text


        return cmd;
    }

    //--------------------------------------------------------------------------------------------------
    // This method change Book Activity
    //--------------------------------------------------------------------------------------------------

    public int changeBookActivity(int bookId)
    {

        SqlConnection con;
        SqlCommand cmd;
        SqlParameter returnValue = new SqlParameter();


        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        cmd = CreateCommandWithStoredProcedurechangeBookActivity("changeBookActivity", con, bookId);             // create the command
        returnValue.ParameterName = "@RETURN_VALUE";
        returnValue.Direction = ParameterDirection.ReturnValue;
        cmd.Parameters.Add(returnValue);
        try
        {
            cmd.ExecuteNonQuery(); // execute the command
            int numEffected = (int)cmd.Parameters["@RETURN_VALUE"].Value;
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }


    //---------------------------------------------------------------------------------
    //  This method change Book Activity
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProcedurechangeBookActivity(String spName, SqlConnection con, int bookId)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text


        cmd.Parameters.AddWithValue("@bookId", bookId);

        return cmd;
    }

}
