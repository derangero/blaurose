-- CreateTable
CREATE TABLE "m_companies" (
    "company_id" TEXT NOT NULL,
    "company_code" CHAR(4) NOT NULL,
    "company_name" TEXT NOT NULL,
    "stamp_delete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3),

    CONSTRAINT "m_companies_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "m_shops" (
    "shop_id" TEXT NOT NULL,
    "shop_code" CHAR(4) NOT NULL,
    "shop_name" TEXT NOT NULL,
    "stamp_hq" BOOLEAN NOT NULL DEFAULT false,
    "company_id" TEXT NOT NULL,
    "stamp_delete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3),

    CONSTRAINT "m_shops_pkey" PRIMARY KEY ("company_id","shop_code")
);

-- CreateTable
CREATE TABLE "m_employees" (
    "employee_id" TEXT NOT NULL,
    "employee_code" CHAR(4) NOT NULL,
    "employee_name" TEXT NOT NULL,
    "company_joined_at" DATE,
    "hourly_wage_amount" INTEGER,
    "shop_id" TEXT NOT NULL,
    "stamp_delete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3),

    CONSTRAINT "m_employees_pkey" PRIMARY KEY ("shop_id","employee_code")
);

-- CreateTable
CREATE TABLE "m_users" (
    "user_id" TEXT NOT NULL,
    "login_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "stamp_delete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3),

    CONSTRAINT "m_users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "t_timecard" (
    "timecard_id" TEXT NOT NULL,
    "stamped_on" INTEGER NOT NULL,
    "stampedFrom_at" TIMESTAMPTZ(3),
    "stampedTo_at" TIMESTAMPTZ(3),
    "rest_minutes_time" INTEGER,
    "actual_working_minutes_time" INTEGER,
    "overtime" INTEGER,
    "late_night_work_time" INTEGER,
    "holiday_work_time" INTEGER,
    "stamp_approval" BOOLEAN NOT NULL DEFAULT false,
    "employee_id" TEXT NOT NULL,
    "stamp_delete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3),

    CONSTRAINT "t_timecard_pkey" PRIMARY KEY ("timecard_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "m_companies_company_code_key" ON "m_companies"("company_code");

-- CreateIndex
CREATE UNIQUE INDEX "m_shops_shop_id_key" ON "m_shops"("shop_id");

-- CreateIndex
CREATE UNIQUE INDEX "m_shops_shop_code_key" ON "m_shops"("shop_code");

-- CreateIndex
CREATE INDEX "m_shops_shop_code_idx" ON "m_shops"("shop_code");

-- CreateIndex
CREATE UNIQUE INDEX "m_employees_employee_id_key" ON "m_employees"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "m_employees_employee_code_key" ON "m_employees"("employee_code");

-- CreateIndex
CREATE INDEX "m_employees_employee_code_idx" ON "m_employees"("employee_code");

-- CreateIndex
CREATE UNIQUE INDEX "m_users_login_id_key" ON "m_users"("login_id");

-- CreateIndex
CREATE UNIQUE INDEX "m_users_employee_id_key" ON "m_users"("employee_id");

-- CreateIndex
CREATE INDEX "m_users_login_id_password_idx" ON "m_users"("login_id", "password");

-- CreateIndex
CREATE INDEX "t_timecard_stamped_on_idx" ON "t_timecard"("stamped_on");

-- CreateIndex
CREATE UNIQUE INDEX "t_timecard_stamped_on_employee_id_key" ON "t_timecard"("stamped_on", "employee_id");

-- AddForeignKey
ALTER TABLE "m_shops" ADD CONSTRAINT "m_shops_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "m_companies"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_employees" ADD CONSTRAINT "m_employees_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "m_shops"("shop_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_users" ADD CONSTRAINT "m_users_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "m_employees"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_timecard" ADD CONSTRAINT "t_timecard_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "m_employees"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;
