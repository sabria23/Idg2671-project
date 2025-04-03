import styles from "../../styles/Dash.module.css";

const DashboardPage = () => {
  return (
    <div className={styles.dashboardContainer}>
        <nav className={styles.navbar}>
            <div className={styles.logo}Study Platform></div>
            <div className={styles.navLinks}>
                <button>My studies</button>
                <button>Account</button>
                <button>Logout</button>
            </div>
        </nav>

        <main className={styles.dashboradContent}>
            <div className={styles.dashboradHeader}>
                <h1>My Studies</h1>
                <Link to="/create-study" className={styles.createStudyBtn}> Create New Study </Link>
            </div>

            <div className={styles.emptyStudyState}>
                <h2>No studies created yet </h2>
                <p>Create your first study to get started!</p>
            </div>
        </main>
    </div>
  )
}

export default DashboardPage