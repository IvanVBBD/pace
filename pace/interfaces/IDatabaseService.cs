using System.Data;
using System.Data.SqlClient;
using System;

namespace Pace.interfaces
{
    public interface IDatabaseService
    {
        public Task<DataTable> ExecuteQuery(string query, SqlParameter[] parameters);
    }
}
