using Pace.interfaces;
using System.Data.SqlClient;
using System.Data;

namespace Pace.Usecases
{
    public class DatabaseService : IDatabaseService
    {
        private readonly string connectionString = "data source=IVANV\\SQLEXPRESS; database=PaceApp; User ID=259;Password=;Integrated Security=SSPI";
        private readonly SqlConnection connection;

        public DatabaseService()
        {
            connection = new SqlConnection(connectionString);
            connection.Open();
        }


        public async Task<DataTable> ExecuteQuery(string query, SqlParameter[] parameters)
        {
            DataTable result = new DataTable();

            using (SqlCommand command = new SqlCommand(query, connection))
            {
                if (parameters != null && parameters.Length > 0)
                {
                    command.Parameters.AddRange(parameters);
                }

                using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                {
                    adapter.Fill(result);
                }
            }

            return result;
        }
    }
}
