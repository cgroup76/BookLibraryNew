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
using static System.Reflection.Metadata.BlobBuilder;

/// <summary>
/// DBServices is a class created by me to provides some DataBase Services
/// </summary>
public class DBservicesAuthor
{

    public DBservicesAuthor() { }

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
    // This method adds a new author to the authors table 
    //--------------------------------------------------------------------------------------------------
    public int AddNewAuthor(Author author)
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

        cmd = CreateCommandWithStoredProcedureAddNewAuthor("addNewAuthor", con, author);             // create the command

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
    // Create the SqlCommand using a stored procedure to add new author
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProcedureAddNewAuthor(String spName, SqlConnection con, Author author)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@name", author.Name);

        return cmd;
    }
    //---------------------------------------------------------------------------------
    // Create the SqlCommand using a stored procedure to find book by author name 
    //---------------------------------------------------------------------------------


    public List<Object> findBookByAuthorName(int authorId)
    {
        SqlConnection con;
        SqlCommand cmd;
        SqlDataReader reader;
        List<Object> books = new List<Object>();

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        cmd = CreateCommandWithStoredProcedurefindBookByAuthorName("findBookByAuthorName", con, authorId); // create the command

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
                books.Add(book);
            }
            return books;
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
    // Create the SqlCommand using a stored procedure to find book by author name 
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProcedurefindBookByAuthorName(String spName, SqlConnection con, int authorId)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@authorId", authorId);


        return cmd;
    }
    //--------------------------------------------------------------------------------------------------
    // This method show all authors 
    //--------------------------------------------------------------------------------------------------

    public List<Author> getAllAuthors()

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

        cmd = CreateCommandWithStoredProceduregetAllAuthors("getAllAuthors", con);             // create the command


        List<Author> authors = new List<Author>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                Author author = new Author();
                author.Id = Convert.ToInt32(dataReader["id"]);
                author.Name = Convert.ToString(dataReader["authorName"]);

                if (dataReader["dateOfBirth"] == null) { author.DateOfBirth = ""; }
                else { author.DateOfBirth = (Convert.ToString(dataReader["dateOfBirth"])).Split(' ')[0]; }

                if (dataReader["dateOfDeath"] == null) { author.DateOfDeath = ""; }
                else { author.DateOfDeath = (Convert.ToString(dataReader["dateOfDeath"])).Split(' ')[0]; }

                string age = Convert.ToString(dataReader["age"]);

                if (age == "") { author.Age = 0; }
                else { author.Age = Convert.ToInt32(age); }

                if (dataReader["nationality"] == null) { author.Nationality = ""; }
                else { author.Nationality = Convert.ToString(dataReader["nationality"]); }

                if (dataReader["notableWork"] == null) { author.NotableWork = ""; }
                else { author.NotableWork = Convert.ToString(dataReader["notableWork"]); }

                if (dataReader["awards"] == null) { author.Awars = ""; }
                else { author.Awars = Convert.ToString(dataReader["awards"]); }

                author.Description = Convert.ToString(dataReader["description"]);

                authors.Add(author);

            }
            return authors;
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
    // Create the SqlCommand using a stored procedure to get all authors 
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProceduregetAllAuthors(String spName, SqlConnection con)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text


        return cmd;
    }
    //--------------------------------------------------------------------------------------------------
    // This method show UserLibaries Per Author
    //--------------------------------------------------------------------------------------------------

    public List<dynamic> UsersLibaryPerAuthor()

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

        cmd = CreateCommandWithStoredProcedureUsersLibaryPerAuthor("UsersLibaryPerAuthor", con);             // create the command


        List<dynamic> authors = new List<dynamic>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                dynamic author = new ExpandoObject();
                author.Name = Convert.ToString(dataReader["name"]);
                author.numOfLibarries = Convert.ToInt32(dataReader["user_count"]);
                authors.Add(author);

            }
            return authors;
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
    // Create the SqlCommand using a stored procedure to get Libary Per Author
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProcedureUsersLibaryPerAuthor(String spName, SqlConnection con)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text


        return cmd;
    }

}
