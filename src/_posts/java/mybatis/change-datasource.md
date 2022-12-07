---

category: csrsm

title: Mybatis多数据源切换

header-title: true

header-image:

- http://img.icoisini.xyz/background.jpg

tags:

- java
- mybatis

date: 2021-01-21

---
# 一、继承AbstractRoutingDataSource实现

⚠️此种方式不支持跨库事务，当方法上加声明式事务注解时（使用时需指定事务BeanName），无法切换数据源，需在使用注解前切换数据源或者使用注解切换时指定执行顺序，在事务注解之前执行。

创建数据源配置类MybatisConfig：

```java
 /**
     * 配置数据源
     */
    @Primary
    @Bean(name = "dataSourceSystem")
    public DataSource dataSourceBusiness(Environment env){
        String prefix = "mas.business.datasource.";
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setUsername(env.getProperty(prefix + "username"));
        dataSource.setPassword(env.getProperty(prefix + "password"));
        dataSource.setUrl(env.getProperty(prefix + "url"));
        dataSource.setDriverClassName(env.getProperty(prefix + "driverClassName"));
        return dataSource;
    }

    @Bean("dynamicDataSource")
    public DynamicDataSource dynamicDataSource(@Qualifier("dataSourceSystem") DataSource dataSource) {
        DynamicDataSource dynamicDataSource = new DynamicDataSource();

        Map<Object, Object> targetDataSource = new HashMap<>();
        targetDataSource.put("default", dataSource);
        dynamicDataSource.setDefaultTargetDataSource(dataSource);
        dynamicDataSource.setTargetDataSources(targetDataSource);
        return dynamicDataSource;
    }

    @Bean
    public SqlSessionFactoryBean sqlSessionFactoryBean(@Qualifier("dynamicDataSource") DataSource dataSource) throws Exception{
        SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource);
        sessionFactory.setTypeAliasesPackage(ALIASES_PACKAGE);
        sessionFactory.setMapperLocations(new PathMatchingResourcePatternResolver().getResources(MAPPER_LOCATION));
        sessionFactory.setConfiguration(configuration());
        return sessionFactory;
    }

    public org.apache.ibatis.session.Configuration configuration() {
        org.apache.ibatis.session.Configuration configuration = new org.apache.ibatis.session.Configuration();
        configuration.setMapUnderscoreToCamelCase(true);
        return configuration;
    }

    public DataSource getDataSource(DataSourceBean dataSourceBean) {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setUsername(dataSourceBean.getDsUsername());
        dataSource.setPassword(dataSourceBean.getDsPassword());
        dataSource.setUrl(dataSourceBean.getUrl());
        dataSource.setDriverClassName(dataSourceBean.getDsDriver());
        return dataSource;
    }
    /**
     * 分页插件
     * @return
     */
    @Bean
    public PaginationInterceptor paginationInterceptor() {
        return new PaginationInterceptor();
    }

    @Bean
    public PlatformTransactionManager annotationDriverTransactionManager(@Qualifier("dynamicDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
```

将这个动态数据源设置到了SQL会话工厂和事务管理器，这样在操作数据库时就会通过动态数据源类来获取要操作的数据源了。

动态数据源类集成了Spring提供的AbstractRoutingDataSource类，AbstractRoutingDataSource 中获取数据源的方法就是 determineTargetDataSource，而此方法又通过 determineCurrentLookupKey 方法获取查询数据源的key，我们将key存储到当前线程的threadLocal中，通过数据源上下文类DataSourceContextHolder来控制。

所以如果我们需要动态切换数据源，就可以通过以下两种方式定制：

1. 覆写 determineCurrentLookupKey 方法：通过覆写 determineCurrentLookupKey 方法，从一个自定义的 DynamicDataSourceContextHolder.getDataSourceKey() 获取数据源key值，这样在我们想动态切换数据源的时候，只要通过 DynamicDataSourceContextHolder.setDataSourceKey(key) 的方式就可以动态改变数据源了。这种方式要求在获取数据源之前，要先初始化各个数据源到 DynamicDataSource 中，我们案例就是采用这种方式实现的，所以在 MybatisConfig 中把master和slave数据源都事先初始化到DynamicDataSource 中。

2. 可以通过覆写 determineTargetDataSource，因为数据源就是在这个方法创建并返回的，所以这种方式就比较自由了，支持到任何你希望的地方读取数据源信息，只要最终返回一个 DataSource 的实现类即可。比如你可以到数据库、本地文件、网络接口等方式读取到数据源信息然后返回相应的数据源对象就可以了。

```java
public class DynamicDataSource extends AbstractRoutingDataSource {

    private boolean debug = false;
    Logger log = LoggerFactory.getLogger(this.getClass());
    private Map<Object, Object> dynamicTargetDataSources;
    private Object dynamicDefaultTargetDataSource;
    @Override
    protected Object determineCurrentLookupKey() {
        String datasource = DataSourceContextHolder.getDataSource();
        if (debug) {
            if (StringUtils.isEmpty(datasource)) {
                log.info("---当前数据源：默认数据源---");
            } else {
                log.info("---当前数据源：" + datasource + "---");
            }
        }
        return datasource;
    }

    @Override
    public void setTargetDataSources(Map<Object, Object> targetDataSources) {
        super.setTargetDataSources(targetDataSources);
        this.dynamicTargetDataSources = targetDataSources;
    }

    // 创建数据源
    public boolean createDataSource(String key, String driveClass, String url, String username, String password) {
        try {
            try { // 排除连接不上的错误
                Class.forName(driveClass);
                DriverManager.getConnection(url, username, password);// 相当于连接数据库
            } catch (Exception e) {
                return false;
            }
            @SuppressWarnings("resource")
            DruidDataSource druidDataSource = new DruidDataSource();
            druidDataSource.setName(key);
            druidDataSource.setDriverClassName(driveClass);
            druidDataSource.setUrl(url);
            druidDataSource.setUsername(username);
            druidDataSource.setPassword(password);
            druidDataSource.setMaxWait(60000);
            druidDataSource.setFilters("stat");
            DataSource createDataSource = (DataSource) druidDataSource;
            druidDataSource.init();
            Map<Object, Object> dynamicTargetDataSources2 = this.dynamicTargetDataSources;
            dynamicTargetDataSources2.put(key, createDataSource);// 加入map
            setTargetDataSources(dynamicTargetDataSources2);// 将map赋值给父类的TargetDataSources
            super.afterPropertiesSet();// 将TargetDataSources中的连接信息放入resolvedDataSources管理
            return true;
        } catch (Exception e) {
            log.error(e + "");
            return false;
        }
    }
    // 删除数据源
    public boolean delDatasources(String datasourceid) {
        Map<Object, Object> dynamicTargetDataSources2 = this.dynamicTargetDataSources;
        if (dynamicTargetDataSources2.containsKey(datasourceid)) {
            Set<DruidDataSource> druidDataSourceInstances = DruidDataSourceStatManager.getDruidDataSourceInstances();
            for (DruidDataSource l : druidDataSourceInstances) {
                if (datasourceid.equals(l.getName())) {
                    System.out.println(l);
                    dynamicTargetDataSources2.remove(datasourceid);
                    DruidDataSourceStatManager.removeDataSource(l);
                    setTargetDataSources(dynamicTargetDataSources2);// 将map赋值给父类的TargetDataSources
                    super.afterPropertiesSet();// 将TargetDataSources中的连接信息放入resolvedDataSources管理
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    }
    // 测试数据源连接是否有效
    public boolean testDatasource(String key, String driveClass, String url, String username, String password) {
        try {
            Class.forName(driveClass);
            DriverManager.getConnection(url, username, password);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
```

⚠️将这个数据源在数据源配置类中手动注入到spring中，实现单例，在DataSourceLoader类中加载保存在数据库中的其他数据源。动态加载数据源时，需要手动执行loadDataSource()方法。

```java
@Component
public class DataSourceLoader {

    @Autowired
    private MybatisPlusConfig mybatisPlusConfig;

    @Autowired
    private IDataSourceService dataSourceServiceImpl;

    @Autowired
    private DynamicDataSource dynamicDataSource;


    @PostConstruct
    public void loadDataSource(){
        List<DataSourceBean> dataSources = dataSourceServiceImpl.queryAll();
        for (DataSourceBean dataSourceBean : dataSources) {
        		dynamicDataSource.createDataSource(dataSourceBean.getAppPageId().toString(),
                                                          dataSourceBean.getDsDriver(),
                                                          dataSourceBean.getUrl(),
                                                          dataSourceBean.getDsUsername(),
                                                          dataSourceBean.getDsPassword());
        }

    }

}
```

### 数据源上下文

动态数据源的切换主要是通过调用这个类的方法来完成的。在任何想要进行切换数据源的时候都可以通过调用这个类的方法实现切换。

```java
public class DataSourceContextHolder {
    private static final ThreadLocal<String> contextHolder = new ThreadLocal<String>();

    public static List<String> dataSourceKeys = new ArrayList<>();

    // 调用此方法，切换数据源
    public static void setDataSource(String dataSource) {
        contextHolder.set(dataSource);
    }
    // 获取数据源
    public static String getDataSource() {
        return contextHolder.get();
    }
    // 删除数据源
    public static void clearDataSource() {
        contextHolder.remove();
    }

    /**
     * @param dataSourceId
     * @return
     */
    public static boolean containsDataSource(String dataSourceId) {
        return dataSourceKeys.contains(dataSourceId);
    }
}
```

### AOP实现

可以通过DataSourceContextHolder类，实现通过切面控制数据源切换。

注解类：

```java
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DataSource {
    
    /**
     * 数据源key值
     * @return
     */
    String value();
    
}
```

切面类：当需要方法参数是，需要通过Around方法执行。

```java
@Aspect
@Order(-1)  // 该切面应当先于 @Transactional 执行
@Component
public class DynamicDataSourceAspect {
    
    /**
     * 切换数据源
     * @param point
     * @param dataSource
     */
    @Before("@annotation(dataSource))")
    public void switchDataSource(JoinPoint point, DataSource dataSource) {
        if (!DynamicDataSourceContextHolder.containDataSourceKey(dataSource.value())) {
            System.out.println("DataSource [{}] doesn't exist, use default DataSource [{}] " + dataSource.value());
        } else {
            // 切换数据源
            DynamicDataSourceContextHolder.setDataSourceKey(dataSource.value());
            System.out.println("Switch DataSource to [" + DynamicDataSourceContextHolder.getDataSourceKey()
                + "] in Method [" + point.getSignature() + "]");
        }
    }
    /**
     * 重置数据源
     * @param point
     * @param dataSource
     */
    @After("@annotation(dataSource))")
    public void restoreDataSource(JoinPoint point, DataSource dataSource) {
        // 将数据源置为默认数据源
        DynamicDataSourceContextHolder.clearDataSourceKey();
        System.out.println("Restore DataSource to [" + DynamicDataSourceContextHolder.getDataSourceKey() 
            + "] in Method [" + point.getSignature() + "]");
    }
}
```



# 二、自定义CustomSqlSessionTemplate实现 



接口调用 >>> SqlSessionTemplate >>> 获取sqlsessionfactory >>> datasource >>> 执行

可以在sqlsessionTemplate处做路由，实现一个自定义CustomSqlSessionTemplate继承SqlSessionTemplate重写getSqlSessionFactory，这样子我们可以创建多个sqlsessionfactory每个sessionfactory包含自己的DataSource，将多个sqlsessionfactory注入到CustomSqlSessionTemplate中，使用一个Map来存储以<数据源名称,sqlsessionfactory>，然后对于mybatis来说仍然只有一个SqlSessionTemplate，当有sql需要执行的时候，mybatis会调用SqlSessionTemplate的getSqlSessionFactory方法来获取当前sessionfactory，由于我们是自己实现的CustomSqlSessionTemplate，可以重写getSqlSessionFactory来动态选择sessionfactory,最后执行sql自然也是到各自的DataSource中去执行。

对于如何做动态选择，可以使用一个ThreadLocal，在service代码中在执行sql前设置ThreadLocal为要操作的数据源名称，然后再getSqlSessionFactory方法中获取ThreadLocal的值来从Map<数据源名称,sqlsessionfactory>中选择sqlsessionfactory，原理如此，但实际开发中不会这么麻烦，可以用aop来绑定当前用户所使用的的DataSource。

## mybatis配置

```java
package com.jinshang.datasource.config.datasource;
 
import com.jinshang.datasource.config.datasource.utils.CustomSqlSessionTemplate;
import com.atomikos.jdbc.AtomikosDataSourceBean;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.mybatis.spring.boot.autoconfigure.SpringBootVFS;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;
 
import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
 
/**
 * @author yuanyang(417168602@qq.com)
 * @date 2019/4/3 10:42
 */
 
@Configuration
@Component
@MapperScan(basePackages = MybatisConfig.BASE_PACKAGE, sqlSessionTemplateRef = "sqlSessionTemplate")
public class MybatisConfig extends AbstractDataSourceConfig {
 
    //mapper模式下的接口层
    static final String BASE_PACKAGE = "com.jinshang.datasource.mapper";
    //对接数据库的实体层
    static final String ALIASES_PACKAGE = "com.jinshang.datasource.domain";
    static final String MAPPER_LOCATION = "classpath:mapper/*.xml";
 
    //创建新数据源时的配置信息
    @Value("${spring.datasource.druid.template.url}")
    private String url;
    @Value("${spring.datasource.druid.template.username}")
    private String username;
    @Value("${spring.datasource.druid.template.password}")
    private String password;
    @Value("${spring.datasource.druid.template.driver-class-name}")
    private String driverClassName;
 
 
    @Primary
    @Bean(name = "dataSourceSystem")
    public DataSource dataSourceOne(Environment env) {
        String prefix = "spring.datasource.druid.system.";
        return getDataSource(env, prefix, "system");
    }
 
    @Bean(name = "sqlSessionFactorySystem")
    public SqlSessionFactory sqlSessionFactoryOne(@Qualifier("dataSourceSystem") DataSource dataSource)
            throws Exception {
        return createSqlSessionFactory(dataSource);
    }
 
 
    @Bean(name = "sqlSessionTemplate")
    public CustomSqlSessionTemplate sqlSessionTemplate(@Qualifier("sqlSessionFactorySystem") SqlSessionFactory factorySystem) throws Exception {
        Map<Object, SqlSessionFactory> sqlSessionFactoryMap = new HashMap<>();
        sqlSessionFactoryMap.put("system", factorySystem);
        CustomSqlSessionTemplate customSqlSessionTemplate = new CustomSqlSessionTemplate(factorySystem);
        customSqlSessionTemplate.setTargetSqlSessionFactorys(sqlSessionFactoryMap);
        return customSqlSessionTemplate;
    }
 
    /**
     * 创建数据源
     *
     * @param dataSource
     * @return
     */
    public SqlSessionFactory createSqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSource);
        bean.setVfs(SpringBootVFS.class);
        bean.setTypeAliasesPackage(ALIASES_PACKAGE);
        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources(MAPPER_LOCATION));
        bean.setConfiguration(configuration());
        return bean.getObject();
    }
 
    public org.apache.ibatis.session.Configuration configuration() {
        org.apache.ibatis.session.Configuration configuration = new org.apache.ibatis.session.Configuration();
        configuration.setMapUnderscoreToCamelCase(true);
        return configuration;
    }
 
    public DataSource getDataSource(String dataSourceName) {
        Properties prop = new Properties();
        prop.put("url", this.url.replace("{dbName}", dataSourceName));
        prop.put("username", this.username);
        prop.put("password", this.password);
        prop.put("driverClassName", this.driverClassName);
        AtomikosDataSourceBean ds = new AtomikosDataSourceBean();
        ds.setXaDataSourceClassName("com.alibaba.druid.pool.xa.DruidXADataSource");
        ds.setUniqueResourceName(dataSourceName);
        ds.setXaProperties(prop);
        return ds;
    }
  
  /**
       * 注入事物管理器
       * @return
       */
    @Bean(name = "xatx")
    public JtaTransactionManager regTransactionManager () {
      UserTransactionManager userTransactionManager = new UserTransactionManager();
      UserTransaction userTransaction = new UserTransactionImp();
      return new JtaTransactionManager(userTransaction, userTransactionManager);
    }
}
```

## CustomSqlSessionTemplate代码

```java
package com.jinshang.datasource.config.datasource.utils;
 
import static java.lang.reflect.Proxy.newProxyInstance;
import static org.apache.ibatis.reflection.ExceptionUtil.unwrapThrowable;
import static org.mybatis.spring.SqlSessionUtils.closeSqlSession;
import static org.mybatis.spring.SqlSessionUtils.getSqlSession;
import static org.mybatis.spring.SqlSessionUtils.isSqlSessionTransactional;
 
 
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.util.List;
import java.util.Map;
 
 
import org.apache.ibatis.exceptions.PersistenceException;
import org.apache.ibatis.executor.BatchResult;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.MyBatisExceptionTranslator;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.dao.support.PersistenceExceptionTranslator;
import org.springframework.util.Assert;
 
 
/**
 * TODO: 增加描述
 *
 * @author Administrator
 * @version 0.1.0
 * @date 2015年9月22日 下午6:27:47
 * @copyright stnts.com
 */
public class CustomSqlSessionTemplate extends SqlSessionTemplate {
 
    private final SqlSessionFactory sqlSessionFactory;
    private final ExecutorType executorType;
    private final SqlSession sqlSessionProxy;
    private final PersistenceExceptionTranslator exceptionTranslator;
 
    private Map<Object, SqlSessionFactory> targetSqlSessionFactorys;
    private SqlSessionFactory defaultTargetSqlSessionFactory;
 
    public void setTargetSqlSessionFactorys(Map<Object, SqlSessionFactory> targetSqlSessionFactorys) {
        this.targetSqlSessionFactorys = targetSqlSessionFactorys;
    }
 
    public Map<Object, SqlSessionFactory> getTargetSqlSessionFactorys() {
        return targetSqlSessionFactorys;
    }
 
    public void setDefaultTargetSqlSessionFactory(SqlSessionFactory defaultTargetSqlSessionFactory) {
        this.defaultTargetSqlSessionFactory = defaultTargetSqlSessionFactory;
    }
 
    public CustomSqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
        this(sqlSessionFactory, sqlSessionFactory.getConfiguration().getDefaultExecutorType());
    }
 
    public CustomSqlSessionTemplate(SqlSessionFactory sqlSessionFactory, ExecutorType executorType) {
        this(sqlSessionFactory, executorType, new MyBatisExceptionTranslator(sqlSessionFactory.getConfiguration()
                .getEnvironment().getDataSource(), true));
    }
 
    public CustomSqlSessionTemplate(SqlSessionFactory sqlSessionFactory, ExecutorType executorType,
                                    PersistenceExceptionTranslator exceptionTranslator) {
 
        super(sqlSessionFactory, executorType, exceptionTranslator);
 
        this.sqlSessionFactory = sqlSessionFactory;
        this.executorType = executorType;
        this.exceptionTranslator = exceptionTranslator;
 
        this.sqlSessionProxy = (SqlSession) newProxyInstance(
                SqlSessionFactory.class.getClassLoader(),
                new Class[]{SqlSession.class},
                new SqlSessionInterceptor());
 
        this.defaultTargetSqlSessionFactory = sqlSessionFactory;
    }
 
    @Override
    public SqlSessionFactory getSqlSessionFactory() {
//        SqlSessionFactory targetSqlSessionFactory = targetSqlSessionFactorys.get(SessionUtils.getCurrentDataSource());
        SqlSessionFactory targetSqlSessionFactory = targetSqlSessionFactorys.get(DataSourceContextHolder.getDatasourceType());
        if (targetSqlSessionFactory != null) {
            return targetSqlSessionFactory;
        } else if (defaultTargetSqlSessionFactory != null) {
            return defaultTargetSqlSessionFactory;
        } else {
            Assert.notNull(targetSqlSessionFactorys, "Property 'targetSqlSessionFactorys' or 'defaultTargetSqlSessionFactory' are required");
            Assert.notNull(defaultTargetSqlSessionFactory, "Property 'defaultTargetSqlSessionFactory' or 'targetSqlSessionFactorys' are required");
        }
        return this.sqlSessionFactory;
    }
 
    @Override
    public Configuration getConfiguration() {
        return this.getSqlSessionFactory().getConfiguration();
    }
 
    public ExecutorType getExecutorType() {
        return this.executorType;
    }
 
    public PersistenceExceptionTranslator getPersistenceExceptionTranslator() {
        return this.exceptionTranslator;
    }
 
    /**
     * {@inheritDoc}
     */
    public <T> T selectOne(String statement) {
        return this.sqlSessionProxy.<T>selectOne(statement);
    }
 
    /**
     * {@inheritDoc}
     */
    public <T> T selectOne(String statement, Object parameter) {
        return this.sqlSessionProxy.<T>selectOne(statement, parameter);
    }
 
    /**
     * {@inheritDoc}
     */
    public <K, V> Map<K, V> selectMap(String statement, String mapKey) {
        return this.sqlSessionProxy.<K, V>selectMap(statement, mapKey);
    }
 
    /**
     * {@inheritDoc}
     */
    public <K, V> Map<K, V> selectMap(String statement, Object parameter, String mapKey) {
        return this.sqlSessionProxy.<K, V>selectMap(statement, parameter, mapKey);
    }
 
    /**
     * {@inheritDoc}
     */
    public <K, V> Map<K, V> selectMap(String statement, Object parameter, String mapKey, RowBounds rowBounds) {
        return this.sqlSessionProxy.<K, V>selectMap(statement, parameter, mapKey, rowBounds);
    }
 
    /**
     * {@inheritDoc}
     */
    public <E> List<E> selectList(String statement) {
        return this.sqlSessionProxy.<E>selectList(statement);
    }
 
    /**
     * {@inheritDoc}
     */
    public <E> List<E> selectList(String statement, Object parameter) {
        return this.sqlSessionProxy.<E>selectList(statement, parameter);
    }
 
    /**
     * {@inheritDoc}
     */
    public <E> List<E> selectList(String statement, Object parameter, RowBounds rowBounds) {
        return this.sqlSessionProxy.<E>selectList(statement, parameter, rowBounds);
    }
 
    /**
     * {@inheritDoc}
     */
    public void select(String statement, ResultHandler handler) {
        this.sqlSessionProxy.select(statement, handler);
    }
 
    /**
     * {@inheritDoc}
     */
    public void select(String statement, Object parameter, ResultHandler handler) {
        this.sqlSessionProxy.select(statement, parameter, handler);
    }
 
    /**
     * {@inheritDoc}
     */
    public void select(String statement, Object parameter, RowBounds rowBounds, ResultHandler handler) {
        this.sqlSessionProxy.select(statement, parameter, rowBounds, handler);
    }
 
    /**
     * {@inheritDoc}
     */
    public int insert(String statement) {
        return this.sqlSessionProxy.insert(statement);
    }
 
    /**
     * {@inheritDoc}
     */
    public int insert(String statement, Object parameter) {
        return this.sqlSessionProxy.insert(statement, parameter);
    }
 
    /**
     * {@inheritDoc}
     */
    public int update(String statement) {
        return this.sqlSessionProxy.update(statement);
    }
 
    /**
     * {@inheritDoc}
     */
    public int update(String statement, Object parameter) {
        return this.sqlSessionProxy.update(statement, parameter);
    }
 
    /**
     * {@inheritDoc}
     */
    public int delete(String statement) {
        return this.sqlSessionProxy.delete(statement);
    }
 
    /**
     * {@inheritDoc}
     */
    public int delete(String statement, Object parameter) {
        return this.sqlSessionProxy.delete(statement, parameter);
    }
 
    /**
     * {@inheritDoc}
     */
    public <T> T getMapper(Class<T> type) {
        return getConfiguration().getMapper(type, this);
    }
 
    /**
     * {@inheritDoc}
     */
    public void commit() {
        throw new UnsupportedOperationException("Manual commit is not allowed over a Spring managed SqlSession");
    }
 
    /**
     * {@inheritDoc}
     */
    public void commit(boolean force) {
        throw new UnsupportedOperationException("Manual commit is not allowed over a Spring managed SqlSession");
    }
 
    /**
     * {@inheritDoc}
     */
    public void rollback() {
        throw new UnsupportedOperationException("Manual rollback is not allowed over a Spring managed SqlSession");
    }
 
    /**
     * {@inheritDoc}
     */
    public void rollback(boolean force) {
        throw new UnsupportedOperationException("Manual rollback is not allowed over a Spring managed SqlSession");
    }
 
    /**
     * {@inheritDoc}
     */
    public void close() {
        throw new UnsupportedOperationException("Manual close is not allowed over a Spring managed SqlSession");
    }
 
    /**
     * {@inheritDoc}
     */
    public void clearCache() {
        this.sqlSessionProxy.clearCache();
    }
 
    /**
     * {@inheritDoc}
     */
    public Connection getConnection() {
        return this.sqlSessionProxy.getConnection();
    }
 
    /**
     * {@inheritDoc}
     *
     * @since 1.0.2
     */
    public List<BatchResult> flushStatements() {
        return this.sqlSessionProxy.flushStatements();
    }
 
    /**
     * Proxy needed to route MyBatis method calls to the proper SqlSession got from Spring's Transaction Manager It also
     * unwraps exceptions thrown by {@code Method#invoke(Object, Object...)} to pass a {@code PersistenceException} to
     * the {@code PersistenceExceptionTranslator}.
     */
    private class SqlSessionInterceptor implements InvocationHandler {
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            final SqlSession sqlSession = getSqlSession(
                    CustomSqlSessionTemplate.this.getSqlSessionFactory(),
                    CustomSqlSessionTemplate.this.executorType,
                    CustomSqlSessionTemplate.this.exceptionTranslator);
            try {
                Object result = method.invoke(sqlSession, args);
                if (!isSqlSessionTransactional(sqlSession, CustomSqlSessionTemplate.this.getSqlSessionFactory())) {
                    // force commit even on non-dirty sessions because some databases require
                    // a commit/rollback before calling close()
                    sqlSession.commit(true);
                }
                return result;
            } catch (Throwable t) {
                Throwable unwrapped = unwrapThrowable(t);
                if (CustomSqlSessionTemplate.this.exceptionTranslator != null && unwrapped instanceof PersistenceException) {
                    Throwable translated = CustomSqlSessionTemplate.this.exceptionTranslator
                            .translateExceptionIfPossible((PersistenceException) unwrapped);
                    if (translated != null) {
                        unwrapped = translated;
                    }
                }
                throw unwrapped;
            } finally {
                closeSqlSession(sqlSession, CustomSqlSessionTemplate.this.getSqlSessionFactory());
            }
        }
    }
 
}
```

## 使用atomikos实现分布式事务管理

在有多个数据源的情况下在同一方法中切换数据源会导致事务的回滚失败，只会默认回滚第一个数据源的事务

⚠️需要在注入Jta事务管理器（已在mybatis配置中注入），并在使用声明式时，指定事务管理器。

```
    /*注入事务管理器*/
    @Bean(name = "xatx")
    public JtaTransactionManager regTransactionManager () {
      UserTransactionManager userTransactionManager = new UserTransactionManager();
      UserTransaction userTransaction = new UserTransactionImp();
      return new JtaTransactionManager(userTransaction, userTransactionManager);
    }
--------------------------------------------------------------------------------------------
    /*使用时*/
    @Transactional(transactionManager="xatx", rollbackFor=Exception.class)
    
```

## 动态数据源添加

**思路**：不多讲了，第一步创建DataSource，使用DataSource创建SqlSessionFactory，然后将此SqlSessionFactory注入到CustomSqlSessionTemplate的Map<数据源名称,sqlsessionfactory>中，**需要注意的是，我们在操作CustomSqlSessionTemplate的sqlsessionfactory的Map时需要考虑线程安全问题，因此最好的做法是创建一个新的Map然后将老的数据导进去然后把新创建的数据源导进去，然后替换原始的map**

```java
public SqlSessionFactory createSqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSource);
        bean.setVfs(SpringBootVFS.class);
        bean.setTypeAliasesPackage(ALIASES_PACKAGE);
        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources(MAPPER_LOCATION));
        bean.setConfiguration(configuration());
        return bean.getObject();
    }
 
    public org.apache.ibatis.session.Configuration configuration() {
        org.apache.ibatis.session.Configuration configuration = new org.apache.ibatis.session.Configuration();
        configuration.setMapUnderscoreToCamelCase(true);
        return configuration;
    }
 
    public DataSource getDataSource(String dataSourceName) {
        Properties prop = new Properties();
        prop.put("url", this.url.replace("{dbName}", dataSourceName));
        prop.put("username", this.username);
        prop.put("password", this.password);
        prop.put("driverClassName", this.driverClassName);
        AtomikosDataSourceBean ds = new AtomikosDataSourceBean();
        ds.setXaDataSourceClassName("com.alibaba.druid.pool.xa.DruidXADataSource");
        ds.setUniqueResourceName(dataSourceName);
        ds.setXaProperties(prop);
        return ds;
    }
 
    /**
     * 初始或者重载入数据源
     *
     * @throws Exception
     */
    @PostConstruct
    public void loadDataSource() throws Exception {
        List<Account> accountList = accountService.queryAll();
        Map<Object, SqlSessionFactory> newSqlSessionFactoryMap = new HashMap<>(16);
        Map<Object, SqlSessionFactory> sqlSessionFactoryMap = sqlSessionTemplate.getTargetSqlSessionFactorys();
        for (Account account : accountList) {
            SqlSessionFactory sqlSessionFactory = mybatisConfig.createSqlSessionFactory(mybatisConfig.getDataSource(account.getDbName()));
            newSqlSessionFactoryMap.put(account.getDbName(), sqlSessionFactory);
        }
        newSqlSessionFactoryMap.putAll(sqlSessionFactoryMap);
        this.sqlSessionTemplate.setTargetSqlSessionFactorys(newSqlSessionFactoryMap);
    }
```

## 动态创建数据源

**思路**：由于我们使用了xa事务，在使用datasource的connection去执行建表建库语句会导致报错，我们只能通过原始的jdbc去创建connection执行建库语句，**然后重新载入数据源！！！**需要注意是但是我们必须得手动控制事务！！！有异常要往上抛

```java
package com.jinshang.datasource.services.impl;
 
import com.jinshang.datasource.config.datasource.utils.DataSourceManager;
import com.jinshang.datasource.domain.Account;
import com.jinshang.datasource.mapper.AccountMapper;
import com.jinshang.datasource.services.AccountService;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import java.sql.*;
import java.util.List;
 
/**
 * @author yuanyang(417168602@qq.com)
 * @date 2019/4/3 13:12
 */
@Service
public class AccountServiceImpl implements AccountService {
 
    @Autowired
    private AccountMapper accountMapper;
 
    @Autowired
    private DataSourceManager dataSourceManager;
 
    @Autowired
    private SqlSessionTemplate sqlSessionTemplate;
 
    @Value("${spring.datasource.druid.system.url}")
    private String url;
    @Value("${spring.datasource.druid.system.username}")
    private String username;
    @Value("${spring.datasource.druid.system.password}")
    private String password;
    @Value("${spring.datasource.druid.system.driver-class-name}")
    private String driverClassName;
 
 
    @Override
    public void insert(Account account) {
        accountMapper.insert(account);
    }
 
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createNewDataSource(String dbName) throws Exception {
        Account account = new Account();
        account.setDbName(dbName);
        createDataBase(dbName);
        accountMapper.insert(account);
        dataSourceManager.loadDataSource();
    }
 
 
    private void createDataBase(String dbName) throws Exception {
//        accountMapper.createDatabase(dbName);
        Connection connection = null;
        Statement st = null;
        try {
            Class.forName(driverClassName);
            connection = DriverManager.getConnection(url, username, password);
            connection.setAutoCommit(false);
            st = connection.createStatement();
            st.execute("create database " + dbName);
            st.execute("use " + dbName);
            st.execute("SET NAMES utf8mb4;\n" +
                    "SET FOREIGN_KEY_CHECKS = 0;\n" +
                    "\n" +
                    "DROP TABLE IF EXISTS `user`;\n" +
                    "CREATE TABLE `user`  (\n" +
                    "  `id` int(11) NOT NULL AUTO_INCREMENT,\n" +
                    "  `name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,\n" +
                    "  PRIMARY KEY (`id`) USING BTREE\n" +
                    ") ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;\n" +
                    "\n" +
                    "SET FOREIGN_KEY_CHECKS = 1;\n");
            connection.commit();
        } catch (Exception e) {
            connection.rollback();
            throw e;
        } finally {
            if (st != null) {
                st.close();
            }
            if (connection != null) {
                connection.close();
            }
        }
    }
 
    @Override
    public List<Account> queryAll() {
        return accountMapper.select();
    }
}
```

