import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Deep import, not the @/shared barrel — see DashboardPage.tsx for why
// (this route's chunk would otherwise also pull in Leaflet/Recharts).
import { DataTable } from "@/shared/components/DataTable";

import { userApi } from "../api/userApi";
import { usersTableColumns } from "../usersTableColumns";

const PAGE_SIZE = 20;

function UsersPage() {
  const [pageIndex, setPageIndex] = useState(0);

  const { data, isPending, isError } = useQuery({
    // pageIndex in the key: a page change is a genuinely different
    // request, not a client-side re-slice of already-fetched data —
    // GET /users is now paginated server-side (see back-end's
    // pagination.dto.ts), so each page must be fetched separately.
    queryKey: ["users", "list", pageIndex],
    queryFn: () => userApi.list({ limit: PAGE_SIZE, offset: pageIndex * PAGE_SIZE }),
  });

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-gray-900">Users</h1>
      <DataTable
        columns={usersTableColumns}
        data={data?.users ?? []}
        isLoading={isPending}
        emptyMessage={isError ? "Failed to load users." : "No users found."}
        serverPagination={{
          pageIndex,
          pageSize: PAGE_SIZE,
          total: data?.pagination?.total ?? 0,
          onPageChange: setPageIndex,
        }}
      />
    </div>
  );
}

export default UsersPage;
